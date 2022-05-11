const server= "https://66bf-8-219-3-31.ngrok.io";
function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
}
function getTop(){
       return $.ajax({
            url : server+"/user/top",
            headers: {
              'Authorization':'Bearer '+localStorage.getItem("jwtToken"),
              'Content-Type':'application/json'
              },
            type : "get",
            dataType:"json",
        });
}

function setUserInfo(info){
  document.getElementById("userInfo").innerText = "Cin chào: "+info['fullName']+" ~"+info['username']+"~";
}

function getUserInfo(){
  return $.ajax({
       url : server+"/user",
       headers: {
        'Authorization':'Bearer '+localStorage.getItem("jwtToken"),
        'Content-Type':'application/json'
        },
       type : "get",
       dataType:"json",
   });
}

function checkValidate(message){
  if(message!=undefined){
  alert(message)
  }
}

async function callUserInfo() {
  try {
       const res = await getUserInfo();
       if (res['username']!=undefined){
          setUserInfo(res);
          callAll();
        }
        else{
          window.location.href = '../auth/login.html';
        }
        
     } catch(err) {
     }
}



async function callAll() {
     try {
          const res = await getTop();
          let html = "";
          var top = 1;
          res.forEach(element => {
            let htmlSegment = 
            `<tr>
            <td style="width:5%">${top++}</td>
              <td style="width:20%">${element.user['username']}</td>
              <td style="width:25%">${element.user['fullName']}</td>
              <td style="width:20%">${element['count']}</td>
              <td style="width:30%">${element.user['favorite']}</td>
            </tr>`;
            html += htmlSegment;
            let dataTable = document.querySelector('#dataTable');
            dataTable.innerHTML = html;
              });
        } catch(err) {
          console.log(err);
        }
}


if(localStorage.getItem("jwtToken")!=null){
    callUserInfo();
}
else{
  window.location.href = '../auth/login.html';
}
