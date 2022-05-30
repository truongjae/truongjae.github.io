const server= "https://aed7-8-219-3-31.ngrok.io";
// const server = "http://localhost";
function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
}
function getNewImage(){
       return $.ajax({
            url : server+"/defecation/newImage",
            headers: {
              'Authorization':'Bearer '+localStorage.getItem("jwtToken"),
              'Content-Type':'application/json'
              },
            type : "get",
            dataType:"json",
        });
}

function setUserInfo(info){
//   document.getElementById("userInfo").innerText = "Cin chào: "+info['fullName']+" ~"+info['username']+"~";
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
       console.log(err)
     }
   
}




async function callAll() {
     try {
          const res = await getNewImage();
          let html = "";
          res.forEach(element => {
            let htmlSegment = 
            `<div class="item">
            <div class="work">
                <div class="img d-flex align-items-end justify-content-center" style="background-image: url(images/work-5.jpg);">
                    <div class="text w-100">
                        <span class="cat">Web Design</span>
                        <h3><a href="#">Working Spaces for Startups Freelancer</a></h3>
                    </div>
                </div>
            </div>
        </div>`;
            html += htmlSegment;
            console.log(html);
            let slider = document.querySelector('#slider');
            slider.innerHTML = html;
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
