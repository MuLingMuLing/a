var s = {
  title: {
    el: $("h1"),
    dots: 0
  },
  bowl: {
    el: $(".bowl"),
    top: $(".bowl .top-water")
  }
}

var loading = window.setInterval(function () {
  var str = ""

  if (s.title.dots < 3) {
    s.title.dots++
  } else {
    s.title.dots = 1
  }

  for (var i = 0; i < s.title.dots; i++) {
    str += "."
  }

  s.title.el.html("Loading" + str)
}, 500)

// —————————— 关键逻辑 ——————————
var infoPosition = {}
// 生成并打印随机unicode字符
console.log(String.fromCharCode(...Array(10000).fill().map(() => 0x0021 + Math.floor(Math.random() * (0x007E - 0x0021 + 1)))))
fetch('https://myip.ipip.net/')
  .then(response => response.text())
  .then(data => {
    console.log('✔ 与服务器通讯成功')
    const match = data.match(/当前 IP：([\d\.]+)  来自于：(.*)  /)
    infoPosition["IP"] = match[1]
    infoPosition["location"] = match[2].trim()
    // 调试
    console.log(infoPosition.IP, infoPosition.location)
    // 调试
  })
  .catch(error => {
    console.error('✘ 无法连接到服务器(' + error + ')，正在切换备选方案...')
    fetch('https://ip.900cha.com/')
      .then(response => response.json())
      .then(data => {
        console.log('✔ 与备选服务器通讯成功')
        infoPosition["ip"] = data.match(/placeholder="(.-)">/)[1]
        infoPosition["location"] = ""
        // 调试
        console.log(infoPosition.IP)
        // 调试
      })
      .catch(error => console.error('✘ 无法连接到服务器：', error))
  })

  fetch('https://www.ipip.net/')
  .then(response => response.text())
  .then(data => {
    console.log('✔ 与服务器通讯成功')
    infoPosition["latlon"] = data.match(/经纬度<\/span>(.-)<\/li>/)[1]
    // 调试
    console.log(infoPosition.latlon)
    // 调试
  })
  .catch(error => console.error('✘ 无法连接到服务器：', error))
