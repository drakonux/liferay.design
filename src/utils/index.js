import { useEffect, useState } from 'react'
import moment from 'moment'
const { firebase } = require('@firebase/app')

const { deburr, replace, startCase } = require(`lodash`)

function onAuthStateChange(callback) {
	return firebase.auth().onAuthStateChanged(user => {
		if (user) {
			callback({ loggedIn: true })
		} else {
			callback({ loggedIn: false })
		}
	})
}
export function isAuthenticated() {
	const [user, setUser] = useState({ loggedIn: false })
	useEffect(() => {
		const unsubscribe = onAuthStateChange(setUser)
		return () => {
			unsubscribe()
		}
	}, [])

	if (!user.loggedIn) {
		return false
	}
	return true
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value)
}

export function getLocalTimeZone() {
	const timeZones = {
		PST: '-08:00',
		PDT: '-07:00',
		BRT: '-03:00',
		WET: '+00:00',
		CET: '+01:00',
		JST: '+09:00',
	}
	const localOffset = moment().format('Z')
	const localTimeZone = getKeyByValue(timeZones, localOffset)
	return localTimeZone
}

export function isLive(eventStart, eventEnd) {
	// now
	var now = new Date()
	var currentUTCDay = now.getUTCDay()
	var currentUTCHours = now.getUTCHours()
	var currentUTCMinutes = now.getUTCMinutes()
	var currentTime = currentUTCHours + ':' + currentUTCMinutes

	// event start
	var eventStartDate = new Date(eventStart)
	var eventStartUTCDay = eventStartDate.getUTCDay()
	var eventStartUTCHours = eventStartDate.getUTCHours()
	var eventStartUTCMinutes = eventStartDate.getUTCMinutes()
	var eventStartTime = eventStartUTCHours + ':' + eventStartUTCMinutes

	// event end
	var eventEndDate = new Date(eventEnd)
	var eventEndUTCDay = eventEndDate.getUTCDay()
	var eventEndUTCHours = eventEndDate.getUTCHours()
	var eventEndUTCMinutes = eventEndDate.getUTCMinutes()
	var eventEndTime = eventEndUTCHours + ':' + eventEndUTCMinutes

	if (currentUTCDay >= eventStartUTCDay && currentTime >= eventStartTime) {
		if (currentUTCDay >= eventEndUTCDay && currentTime >= eventEndTime) {
			return 'is dead'
		} else {
			return 'is live'
		}
	}
}

const imagePath = '/images/headshots/'

export function makeAuthorSlug(input) {
	const normalizedInput = deburr(input.toLowerCase()) // Daniela de la Garza => daniela de la garza
	const stringToArray = normalizedInput.split(' ') // daniela de la garza => ['daniela', 'de', 'la', 'garza']
	const firstName = stringToArray.shift() // ['daniela', 'de', 'la', 'garza'] => 'daniela'
	const lastName = stringToArray.slice() // ['daniela', 'de', 'la', 'garza'] => ['de', 'la', 'garza']
	const authorSlug = lastName.concat([firstName]).join('-')
	return authorSlug
}

export function headshotPath(input) {
	const headshotPath = imagePath + makeAuthorSlug(input) + '.jpg'
	return headshotPath
}

export function avatarPath(input) {
	const avatarPath = imagePath + makeAuthorSlug(input) + '-h.jpg'
	return avatarPath
}

export function slugToTitle(baseSlug, title) {
	const rawTitle = replace(title, baseSlug, '')
	const titleCase = startCase(rawTitle)
	return titleCase
}

export function slugToIcon(baseSlug, icon) {
	const rawIcon = replace(icon, baseSlug, '')
	const replaceHyphen = rawIcon.replace('-', '_')
	const iconName = replaceHyphen.replace('/', '')
	return iconName
}

export function firstWord(input) {
	const string = input.split(' ')[0]
	return string
}

export function slugToSection(input) {
	const section = input.split('/')[1]
	return section
}
