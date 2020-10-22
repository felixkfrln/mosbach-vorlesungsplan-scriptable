// Made by F.K. INF19A :)

let course = 'inf19a'
let param = args.widgetParameter
if (param != null && param.length > 0) {
  course = param
}

const lecturingData = await getTodaysLecturingData()
const widget = new ListWidget()
await createWidget()


//If you run it in the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()


//Create Widget
async function createWidget() {

  //Background Gradient
  let gradient = new LinearGradient()
  gradient.locations = [0,0.5, 1]
  gradient.colors = [
    new Color("0F2027"),
    new Color("203A43"),
    new Color("2C5364")
  ]
  widget.backgroundGradient = gradient

  //DHBW Logo
  const logoReq = new Request('https://i.ibb.co/XkRGw53/logo.png')
  const logoImg = await logoReq.loadImage()
  const wimg = widget.addImage(logoImg)
  wimg.imageSize = new Size(40, 40)
  wimg.rightAlignImage()

  let vStack = widget.addStack()
  vStack.layoutVertically()

  const titleText = vStack.addText("Heute")
  titleText.font = Font.boldRoundedSystemFont(18)
  titleText.textColor = Color.white()
  vStack.addSpacer(8)

  let lectureText = []
  let scheduleText = []

  let noMoreLecturesAvailable = true
  for (var i = 0; i <= 1; i++) {
    const showLectures = lecturingData[i][1].getDay() == new Date().getDay() && lecturingData[i][2].getHours() >= new Date().getHours()
    if (showLectures) {
      noMoreLecturesAvailable = false
      lectureText[i] = vStack.addText(lecturingData[i][0].toString())
      lectureText[i].font = Font.mediumRoundedSystemFont(10)
      lectureText[i].textColor = Color.white()
      scheduleText[i] = vStack.addText(timeToString(lecturingData[i][1])+ " - " + timeToString(lecturingData[i][2]))
      scheduleText[i].textColor = Color.white()
      vStack.addSpacer(6)
    }
  }
  if (noMoreLecturesAvailable) {
    lectureText[0] = vStack.addText("Keine weiteren Vorlesungen")
    lectureText[0].font = Font.mediumRoundedSystemFont(10)
    lectureText[0].textColor = Color.white()
  }
}

//Getting LecturingData
async function getTodaysLecturingData() {
  const url = 'https://api.rickstack.de/?course=' + course
  const req = new Request(url)
  const apiResult = await req.loadJSON()
  // Lecturing Name, Start Time, End Time
  return vorlesungsData = [[apiResult[0].name, new Date(apiResult[0].start), new Date(apiResult[0].end)],[apiResult[1].name, new Date(apiResult[1].start), new Date(apiResult[1].end)]]
}

//Create 24H Timestring e.g.: 12:23
function timeToString(date){
  let datestring = ""
  if (date.getHours() < 10) {
    datestring = "0"+date.getHours()
  } else {
    datestring = date.getHours()
  }
  datestring += ":"
  if (date.getMinutes() < 10) {
    datestring += "0"+ date.getMinutes()
  } else {
    datestring += date.getMinutes()
  }
  return datestring
}
