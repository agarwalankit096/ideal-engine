let $ = require('jquery')
let fs = require('fs')
let filename = 'contacts'
let sno = 0
const { ipcRenderer } = require('electron')

$('#add-to-list').on('click', () => {
   let name = $('#Name').val()
   let email = $('#Email').val()
   console.log(name,email)

   fs.appendFile(filename, name + ',' + email + '\n',(err) => {
         if(err)
            console.log(err)
      })

   addEntry(name, email)
   //loadAndDisplayContacts()
})


$('#del-from-list').on('click', () => {
	fs.unlink(filename, function(err)
	{
		if(err)
		{
			return console.error(err)
		}
		console.log("file deleted")
		sno=0
		$('#contact-table td').remove()
	})
	//loadAndDisplayContacts()
})

function addEntry(name, email) {

   if(name && email) {
      sno++
      // let updateString = '<tr><td>'+ sno + '</td><td>'+ name +'</td><td>' 
      //    + email +'</td>'+ '<td><button class = "btn btn-primary" name = '+name+' id = "take-from-list">Details</button></td></tr>'
      // $('#contact-table').append(updateString)
      const table = document.getElementById('contact-table')
      table.innerHTML += "<tr>" + 
                   "<td>" + sno + "</td>" +
                   "<td>" + name + "</td>" +
                   "<td>" + email + "</td>" +
                   "<td><button class = 'btn btn-primary' name = "+name+" id = 'take-from-list' onclick='return clickit(name)'>Details</button></td>" +
                   "</tr>"
   }
}

function clickit(name)
{
	document.getElementById('take-from-list').style.color = "red"
	console.log(name)
	ipcRenderer.send('show-popup', name)
}

$('#take-from-list-all').on('click', ()=> 
{
	console.log("click")
	ipcRenderer.send('show-popup-all')

})

function loadAndDisplayContacts() {  
   
   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      
      data.forEach((contact, index) => {
         let [ name, email ] = contact.split(',')
         addEntry(name, email)
      })
   
   } else {
      console.log("File Doesn\'t Exist. Creating new file.")
      fs.writeFile(filename, '', (err) => {
         if(err)
            console.log(err)
      })
   }
}

loadAndDisplayContacts()