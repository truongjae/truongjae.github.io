const server= "https://66bf-8-219-3-31.ngrok.io";
function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
}
function getAllByUser(){
       return $.ajax({
            url : server+"/defecation",
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
  document.getElementById("fovorite").innerText = info['favorite'];
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
          const res = await getAllByUser();
          console.log(res.length)
          document.getElementById("countDefecation").innerText += ` ( ${res.length} lần không chùi đuýt)`;
          let html = "";
          res.forEach(element => {
            let htmlSegment = 
            `<tr>
              <td style="width:5%">${element['id']}</td>
              <td style="width:20%">${element['address']}</td>
              <td style="width:25%">${element['color']}</td>
              <td style="width:20%">${dateFormat(new Date(element['createdDate']), "dddd, dd-mm-yyyy, HH:MM:ss")}</td>`;
              
            if(element['fileType']==true)
              htmlSegment+=`<td style="width:40%"><video style="width:100%" controls src="${element['linkImage']}"></video></td>
                              </tr>`;
            else
                htmlSegment+=`<td style="width:40%"><img id="imageShit" src="${element['linkImage']}" alt=""></td>
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
