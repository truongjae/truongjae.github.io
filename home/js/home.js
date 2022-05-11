const server= "https://66bf-8-219-3-31.ngrok.io";
function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
}
function getAllByUserAndDate(){
       return $.ajax({
            url : server+"/defecation/date",
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
       // data : {
           
       // },
       // success : function (result){
       //     result.forEach(element => {
       //       console.log(element['address'])
       //     });
       // }
   });
}
function checkValidate(message){
    if(message!=undefined){
    alert(message)
    }
  }
  

function addDefecationImage(result){
        var data = {};
        var formData = $('#form-defecation').serializeArray();
        $.each(formData, function (i, v) {
            data["" + v.name + ""] = v.value;
        });
        if(result!=null){
            data["" + "linkImage" + ""] = result;
        }

        $.ajax({
            url: (server+'/defecation'),
            headers: {
            'Authorization':'Bearer '+localStorage.getItem("jwtToken"),
            'Content-Type':'application/json'
            },
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            data: JSON.stringify(data),
            success: function (result) {
                document.getElementById("loading").style.display="none";
                alert(result['message']);
                window.location.href = 'home.html';
            },
            error: function (xhr, status, error) {
              document.getElementById("loading").style.display="none";
                var result = xhr.responseJSON;
                checkValidate(result['message']);
                checkValidate(result['address']);
                checkValidate(result['color']);
            }
        });
}

function addDefecation(){
   
  $('#btnAddDefecation').click(function (e) {
    e.preventDefault();
    var data = new FormData();
    $.each($('#file')[0].files, function(i, file) {
        data.append('file', file);
    });
    document.getElementById("loading").style.display="flex";
    $.ajax({
        url: (server+'/upload'),
        headers: {
        'Authorization':'Bearer '+localStorage.getItem("jwtToken")
        },
        type: "POST",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (result) {
            addDefecationImage(result);
        },
        error: function (xhr, status, error) {
            if(status == "error")
                addDefecationImage(null);
            else{
              var result = xhr.responseJSON;
              checkValidate(result['message']);
              window.location.href = 'home.html';
            }   
        }
    });
});
  }
async function callUserInfo() {
  try {
       const res = await getUserInfo();
       if (res['username']!=undefined){
          setUserInfo(res);
          callAll();
          addDefecation();
        }
        else{
          window.location.href = '../auth/login.html';
        }
        
     } catch(err) {
     }
}


async function callAll() {
     try {
          const res = await getAllByUserAndDate();
          if(res.length>0)
            document.getElementById("countDefecation").innerText = "Cậu đã chùi đuýt "+res.length+" lần trong hôm nay";
          else
            document.getElementById("countDefecation").innerText = "Hôm nay bạn chưa chùi đuýt";
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
