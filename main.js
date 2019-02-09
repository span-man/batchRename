const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const ipc = require('electron').ipcMain
const url = require('url')
const path = require('path')

function createWindow () {
  // win = new BrowserWindow({ width: 800, height: 600,frame:false })
  win = new BrowserWindow({ width: 750, height: 650, title: '文件批量改名' }) // 这里 写入的title在加载软件的时候就一直显示，若放在 html中的title中 则要在加载后才显示的
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))
  // win.loadFile('index.html')
  // win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}
app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})


ipc.on('add', (e, _obj) => {
  console.log("_obj----------->", _obj);
  let dirName = _obj.dirName;
  let changeBefore = _obj.changeBefore;
  let changeAfter = _obj.changeAfter;

  // fs.readFile('F:/test/')
  fs.readdir(dirName, (err, data) => {
    if (err) {
      return console.error(err)
    }
    // let dataArr=data.map((value)=>{
    //     return value.replace('。十万度',"")
    // })
    // console.log("异步读取："+ dataArr)

    data.map((value) => {

      /**
       * 中文剧名  非正则使用
       */
      // let reg = /\d\d/g;
      // if(!value.match(reg)[0]){
      //     console.log('有其他文件妨碍改名。')
      //     return false
      // }
      // let bbb = value.match(reg)[0]
      // console.log(bbb)
      // let n1 = '一言为定 第';
      // let n2 = '集.rmvb';
      // let newname = n1 + bbb + n2;
      // console.log(newname)
      //let newname = value.replace(changeBefore, changeAfter)

      /**
       * 英文剧名  正则使用
       */
      // let reg = /[S,s]\d\d[E,e]\d\d/g;
      // let bbb = value.match(reg)[0]
      // console.log(bbb)
      // let cc = bbb.match(/\d\d/g)
      // let newname = `block hole 第${cc[0]}季 第${cc[1]}集.rmvb`
      // console.log(newname)

      /**
       * 火影忍者案例
       * 需求是：将文件夹名字中带有 集数数字 当做正则，删除其他文字，只用数字当集数
       *   NARUTO 第612話.mp4 --> 612.mp4
       * 正则使用
       */
      // let reg = /\d{3}/g;
      // let bbb = value.match(reg)
      // let tempArr = value.split('.');
      // let format = tempArr[tempArr.length - 1]
      // console.log('影片的格式是->', format)
      // console.log(bbb)
      // let newname = `${bbb}.${format}`
      // // console.log(newname)

      let newname = value.replace(changeBefore, changeAfter)

      //修改旧名字 为新名字
      fs.rename(dirName + `/${value}`, dirName + `/${newname}`, (err) => {
        if (err) {
          return console.error(err)
        }
        console.log('done!');
      })

    })

  })







})

ipc.on('jingjian', (e, _obj) => {
  console.log("_obj----------->", _obj);
  let dirName = _obj.dirName;
  let videoName = _obj.videoName;

  // fs.readFile('F:/test/')
  fs.readdir(dirName, (err, data) => {
    if (err) {
      return console.error(err)
    }
    data.map((value) => {
      /**
       * 英文剧名  正则使用
       */
      let reg = /[S,s]\d*[E,e]\d*/g;
      let SE = value.match(reg);
      if (!SE) {//如果没有想要的 格式就 xx 掉
        return false;
      }
      SE = SE[0].toUpperCase();

      console.log("SE-第几季第几集-->", SE);

      let re = /\.\w{1,6}$/g;     //视频文件的格式 .mp4
      let videoType = value.match(re);//
      if (!videoType) {//如果没有想要的 格式就 xx 掉
        return false;
      }
      console.log("videoType-视频文件的格式---->", videoType)
      // let cc = SE.match(/\d\d/g)
      // let newname = `${dirName} 第${cc[0]}季 第${cc[1]}集.rmvb`
      let newname = `${videoName} ${SE}${videoType}`
      console.log("newName--->", newname);

      //修改旧名字 为新名字
      fs.rename(dirName + `/${value}`, dirName + `/${newname}`, (err) => {
        if (err) {
          return console.error(err)
        }
        console.log('done!');
      })

    })

  })

})
