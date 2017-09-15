'use strict'

const util = require('./util.js')
const {app, BrowserWindow, TouchBar, clipboard} = require('electron')
const {TouchBarLabel, TouchBarButton, TouchBarSlider, TouchBarColorPicker, TouchBarSpacer, TouchBarPopover} = TouchBar

let colorHex, colorRGB, colorHistory = []

// Colorpicker Util
let colorpicker = new TouchBarColorPicker({
  change: color => changeColor(color)
})

// Color box
let colorBox = new TouchBarButton({
  click: () => {clipboard.writeText(`rgb(${colorRGB.toString()})`)}
})
// Hex Label
let colorHexLabel = new TouchBarLabel()
// Hex Label
let colorRGBLabel = new TouchBarLabel()
// Red Label
let colorRedLabel = new TouchBarLabel({textColor: '#FF573A'})
// Green Label
let colorGreenLabel = new TouchBarLabel({textColor: '#69C33B'})
// Blue Label
let colorBlueLabel = new TouchBarLabel({textColor: '#41A5E1'})

let redSlider = new TouchBarSlider({
  minValue: 0, maxValue: 255,
  change: red => changeColor(util.RGBToHex([red, colorRGB[1], colorRGB[2]]))
})
let greenSlider = new TouchBarSlider({
  minValue: 0, maxValue: 255,
  change: green => changeColor(util.RGBToHex([colorRGB[0], green, colorRGB[2]]))
})
let blueSlider = new TouchBarSlider({
  minValue: 0, maxValue: 255,
  change: blue => changeColor(util.RGBToHex([colorRGB[0], colorRGB[1], blue]))
})

let sliders = new TouchBarPopover({
  label: 'sliders',
  items: new TouchBar([
    colorBox,
    redSlider, colorRedLabel,
    greenSlider, colorGreenLabel,
    blueSlider, colorBlueLabel,
    new TouchBarSpacer(),
    colorHexLabel
  ])
})

let lightness1 = new TouchBarButton({click: () => changeColor(util.lightness(colorHex, -15))})
let lightness2 = new TouchBarButton({click: () => changeColor(util.lightness(colorHex, -10))})
let lightness3 = new TouchBarButton({click: () => changeColor(util.lightness(colorHex, -5))})
let lightness4 = new TouchBarButton({label: 'Actual'})
let lightness5 = new TouchBarButton({click: () => changeColor(util.lightness(colorHex, 5))})
let lightness6 = new TouchBarButton({click: () => changeColor(util.lightness(colorHex, 10))})
let lightness7 = new TouchBarButton({click: () => changeColor(util.lightness(colorHex, 15))})

let lightness = new TouchBarPopover({
  label: 'Lightness',
  items: new TouchBar([
    new TouchBarSpacer(), lightness1, lightness2, lightness3, lightness4, lightness5, lightness6, lightness7, colorHexLabel
  ])
})

let hue1 = new TouchBarButton({click: () => changeColor(util.hue(colorHex, -15))})
let hue2 = new TouchBarButton({click: () => changeColor(util.hue(colorHex, -10))})
let hue3 = new TouchBarButton({click: () => changeColor(util.hue(colorHex, -5))})
let hue4 = new TouchBarButton({label: 'Actual'})
let hue5 = new TouchBarButton({click: () => changeColor(util.hue(colorHex, 5))})
let hue6 = new TouchBarButton({click: () => changeColor(util.hue(colorHex, 10))})
let hue7 = new TouchBarButton({click: () => changeColor(util.hue(colorHex, 15))})

let hue = new TouchBarPopover({
  label: 'Hue',
  items: new TouchBar([
    new TouchBarSpacer(), hue1, hue2, hue3, hue4, hue5, hue6, hue7, colorHexLabel
  ])
})

let natural1 = new TouchBarButton({click: () => changeColor(util.natural(colorHex, -15))})
let natural2 = new TouchBarButton({click: () => changeColor(util.natural(colorHex, -10))})
let natural3 = new TouchBarButton({click: () => changeColor(util.natural(colorHex, -5))})
let natural4 = new TouchBarButton({label: 'Actual'})
let natural5 = new TouchBarButton({click: () => changeColor(util.natural(colorHex, 5))})
let natural6 = new TouchBarButton({click: () => changeColor(util.natural(colorHex, 10))})
let natural7 = new TouchBarButton({click: () => changeColor(util.natural(colorHex, 15))})

let natural = new TouchBarPopover({
  label: 'Natural',
  items: new TouchBar([
    new TouchBarSpacer(), natural1, natural2, natural3, natural4, natural5, natural6, natural7, colorHexLabel
  ])
})
let history = new TouchBarPopover({
  label: 'History',
  items: new TouchBar([])
})

let touchbar = new TouchBar([
  colorBox,
  colorpicker,
  // history,
  sliders,
  lightness,
  hue,
  natural,
  new TouchBarSpacer({size: 'large'}),
  colorHexLabel,
  colorRGBLabel
])

let changeColor = hex => {
  clipboard.writeText(hex)
  addHistory(hex);
  colorHex = hex
  colorRGB = util.hexToRGB(hex)
  colorBox.backgroundColor = colorHex
  colorpicker.selectedColor = colorHex
  colorHexLabel.label = colorHex
  colorRGBLabel.label = `[${colorRGB.toString()}]`
  colorRedLabel.label = colorRGB[0].toString()
  colorGreenLabel.label = colorRGB[1].toString()
  colorBlueLabel.label = colorRGB[2].toString()
  redSlider.value = colorRGB[0]
  greenSlider.value = colorRGB[1]
  blueSlider.value = colorRGB[2]
  lightness1.backgroundColor = util.lightness(colorHex, -15)
  lightness2.backgroundColor = util.lightness(colorHex, -10)
  lightness3.backgroundColor = util.lightness(colorHex, -5)
  lightness4.backgroundColor = colorHex
  lightness5.backgroundColor = util.lightness(colorHex, 5)
  lightness6.backgroundColor = util.lightness(colorHex, 10)
  lightness7.backgroundColor = util.lightness(colorHex, 15)
  hue1.backgroundColor = util.hue(colorHex, -15)
  hue2.backgroundColor = util.hue(colorHex, -10)
  hue3.backgroundColor = util.hue(colorHex, -5)
  hue4.backgroundColor = colorHex
  hue5.backgroundColor = util.hue(colorHex, 5)
  hue6.backgroundColor = util.hue(colorHex, 10)
  hue7.backgroundColor = util.hue(colorHex, 15)
  natural1.backgroundColor = util.natural(colorHex, -15)
  natural2.backgroundColor = util.natural(colorHex, -10)
  natural3.backgroundColor = util.natural(colorHex, -5)
  natural4.backgroundColor = colorHex
  natural5.backgroundColor = util.natural(colorHex, 5)
  natural6.backgroundColor = util.natural(colorHex, 10)
  natural7.backgroundColor = util.natural(colorHex, 15)
}

let addHistory = hex => {
   if (colorHistory.length < 10) { colorHistory.push(hex) }
   else {
     for(let i = 0; i <= 9; i++) {
       colorHistory[i + 1] = colorHistory[i]
     }
     colorHistory[0] = hex
   }
   let colors = []
   for (let color of colorHistory) {
     colors.push(new TouchBarButton({
       label: color,
       click: () => changeColor(color)
     }))
   }

   history = new TouchBarPopover({
     label: 'History',
     items: new TouchBar(colors)
   })
}

app.on('ready', () => {
  let win = new BrowserWindow({
    alwaysOnTop: true,
    width: 0, height: 0,
    x: 0, y: 0,
    frame: false,
    hasShadow: false
  })
  win.setTouchBar(touchbar)
  win.on('closed', () => {
    win = undefined
  })
  changeColor('#00AEEF')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
