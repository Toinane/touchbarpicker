'use strict'

let getRGBFromHSL = hsl => {
  let h = hsl[0] / 360
  let s = hsl[1] / 100
  let l = hsl[2] / 100
  let t1, t2, t3, rgb, val

  if (s === 0) {
    val = l * 255
    return [val, val, val]
  }
  if (l < 0.5) t2 = l * (1 + s)
  else t2 = l + s - l * s

  t1 = 2 * l - t2
  rgb = [0, 0, 0]

  for (let i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * -(i - 1)
    if (t3 < 0) t3++
    if (t3 > 1) t3--
    if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3
    else if (2 * t3 < 1) val = t2
    else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6
    else val = t1

    rgb[i] = Math.round(val * 255)
  }
  return rgb
}

let getHSLFromRGB = rgb => {
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255
  let min = Math.min(r, g, b)
  let max = Math.max(r, g, b)
  let delta = max - min
  let h, s, l

  if (max === min) h = 0
  else if (r === max) h = (g - b) / delta
  else if (g === max) h = 2 + (b - r) / delta
  else if (b === max) h = 4 + (r - g) / delta

  h = Math.min(h * 60, 360)
  if (h < 0) h += 360
  l = (min + max) / 2

  if (max === min) s = 0
  else if (l <= 0.5) s = delta / (max + min)
  else s = delta / (2 - max - min)

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

let getRGBFromHSV = hsv => {
  const h = hsv[0] / 60
  const s = hsv[1] / 100
  let v = hsv[2] / 100
  const hi = Math.floor(h) % 6

  const f = h - Math.floor(h)
  let p = 255 * v * (1 - s)
  let q = 255 * v * (1 - (s * f))
  let t = 255 * v * (1 - (s * (1 - f)))
  v *= 255

  v = Math.round(v)
  t = Math.round(t)
  p = Math.round(p)
  q = Math.round(q)

  if (hi === 0) return [v, t, p]
  else if (hi === 1) return [q, v, p]
  else if (hi === 2) return [p, v, t]
  else if (hi === 3) return [p, q, v]
  else if (hi === 4) return [t, p, v]
  else if (hi === 5) return [v, p, q]
}

let getHSVFromRGB = rgb => {
  const r = rgb[0]
  const g = rgb[1]
  const b = rgb[2]
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  const delta = max - min
  let h
  const s = max === 0 ? 0 : (delta / max * 1000) / 10
  const v = ((max / 255) * 1000) / 10

  if (max === min) h = 0
  else if (r === max) h = (g - b) / delta
  else if (g === max) h = 2 + ((b - r) / delta)
  else if (b === max) h = 4 + ((r - g) / delta)
  h = Math.min(h * 60, 360)
  if (h < 0) h += 360

  return [Math.round(h), Math.round(s), Math.round(v)]
}

let hexToRGB = hex => {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  let num = parseInt(hex, 16)
  return [num >> 16, num >> 8 & 255, num & 255]
}

let RGBToHex = rgb => {
  let hex = [Number(rgb[0]).toString(16), Number(rgb[1]).toString(16), Number(rgb[2]).toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hex[i] < 10 || hex[i].length === 1) hex[i] = '0' + hex[i]
  }
  return '#' + hex.join('').toUpperCase()
}

let lightness = (hex, light) => {
  let hsl = getHSLFromRGB(hexToRGB(hex))
  hsl = [hsl[0], hsl[1], (hsl[2] + light)]
  let rgb = getRGBFromHSL(hsl)
  for (let i = 0; i < rgb.length; i++) {
    if (rgb[i] < 0) rgb[i] = 0
    if (rgb[i] > 255) rgb[i] = 255
  }
  return RGBToHex(rgb)
}

let hue = (hex, degrees) => {
  const hsl = getHSLFromRGB(hexToRGB(hex))
  hsl[0] += degrees
  if (hsl[0] > 360) hsl[0] -= 360
  else if (hsl[0] < 0) hsl[0] += 360
  return RGBToHex(getRGBFromHSL(hsl))
}

let natural = (hex, percent) => {
  let hsv = getHSVFromRGB(hexToRGB(hex))
  let h = hsv[0]
  let s = hsv[1]
  let v = hsv[2]

  h += 0.8 * percent
  if (h > 360) h -= 360
  else if (h < 0) h += 360

  if (hsv[0] > 240 || hsv[0] < 60) {
    if (percent > 0) s -= 0.7 * percent
    else s -= 0.7 * percent
    if (s > 100) s = 100
    else if (s < 0) s = 0

    if (percent < 0) v += 0.4 * percent
    else v += 0.3 * percent
    if (v > 100) v = 100
    else if (v < 0) v = 0
  } else {
    if (percent > 0) s += 0.7 * percent
    else s += 0.7 * percent
    if (s > 100) s = 100
    else if (s < 0) s = 0

    if (percent < 0) v -= 0.4 * percent
    else v -= 0.3 * percent
    if (v > 100) v = 100
    else if (v < 0) v = 0
  }

  return RGBToHex(getRGBFromHSV([h, s, v]))
}

module.exports = {
  hexToRGB: hexToRGB,
  RGBToHex: RGBToHex,
  lightness: lightness,
  hue: hue,
  natural: natural
}
