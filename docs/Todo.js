function addtask(){
    let task = document.getElementById("taskInput").value;
    let sdate = document.getElementById("schedD").value;
    let stime = document.getElementById("schedT").value;

    let dtime = sdate +' '+ stime;

    fetch("https://todo-alerter.onrender.com/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: task,
            time: dtime
        })
    }).then(() => loadTasks());
}
function loadTasks() {
    fetch("https://todo-alerter.onrender.com/tasks")
    .then(response => response.json())
    .then(data => {
        let list = document.getElementById("taskTable");
        list.innerHTML = "";
        list.innerHTML = `<tr>
        <th>Task ID</th>
        <th>Logged On</th>
        <th>Task Name</th>
        <th>Scheduled On</th>
        </tr>`
        for (let i = 0; i < data.length; i++) {

            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerText = data[i]._id;
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.innerText = data[i].created_on.slice(0,10)+' '+data[i].created_on.slice(11,16);
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.innerText = data[i].title;
            tr.appendChild(td3);
            let td4 = document.createElement("td");
            td4.innerText = data[i].time; 
            tr.appendChild(td4);
            let delet = document.createElement("td");
            let button = document.createElement("button");
            button.onclick = function(){
                Delete(data[i]._id);
            }
            button.innerText = "Delete";
            delet.appendChild(button);
            tr.appendChild(delet);
            list.appendChild(tr);
        }
    });
}

function Delete(id){
    fetch(`https://todo-alerter.onrender.com/delete?id=${id}`, {method: "DELETE"}).then(()=>loadTasks())
    
}


function checkAlert() {
    let alertSound = new Audio("yahooAlert.mpeg");

    fetch("https://todo-alerter.onrender.com/alert")
        .then(res => res.json())
        .then(task => {
            if (!task._id) return;   // no alert
            alertSound.play();
            alert("Reminder: " + task.title + "\nScheduled at: " + task.time);
            
            // delete after user closes alert
            Delete(task._id);
        });
}

// check every 10 seconds
setInterval(checkAlert, 10000);



loadTasks();
document.getElementById("taskInput").value = "";
document.getElementById("schedD").value = "";
document.getElementById("schedT").value = "";
