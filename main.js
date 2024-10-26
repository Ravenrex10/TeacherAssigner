const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { initializeDatabase, addTeacher, getTeachers } = require('./src/database/database'); 

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./src/templates/timetable.html')
  win.webContents.openDevTools();  // Opens DevTools
}

// IPC communication for adding a teacher
ipcMain.on('add-teacher', (event, teacher) => {
  addTeacher(teacher.firstName, teacher.lastName);
  event.reply('teacher-added', { status: 'success' });
});

ipcMain.handle('get-teachers', async (event) => {
  try {
    const teachers = await getTeachers(); // Fetch teachers from the database
    return teachers; // Return the result to the renderer process
  } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error; // Propagate the error
  }
});

app.whenReady().then(() => {
  initializeDatabase();
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})