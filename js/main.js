var hours = [
	"6 am",
	"7 am",
	"8 am",
	"9 am",
	"10 am",
	"11 am",
	"12 pm",
	"1 pm",
	"2 pm",
	"3 pm",
	"4 pm",
	"5 pm",
];

var weekdays = [
	"sun",
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat"
];

var tableBorderSize = parseFloat($("body").css("--table-border-size"));



// Generate weekday headings
for (let w = 0; w < weekdays.length + 1; w++) {
	if (w == 0) dayData = "";
	else dayData = weekdays[w - 1];
	$(".weekday-heading-container").append(`
		<div class="weekday-heading">
			<span>${dayData}<span>
		</div>
	`);
}



// Looping through hours of the day
for (let h = 0; h < hours.length; h++) {
	let hourRow = $(`<div class="tr"></div>`);

	// Looping through days of the week
	for (let w = 0; w < weekdays.length + 1; w++) {
		let dataInclude = (w == 0) ? hours[h] : "";
		hourRow.append(`
			<div class="td" day="${weekdays[w - 1]}" time="${hours[h]}">
				<span>${dataInclude}</span>
			</div>
		`);
	}

	$(".schedule").append(hourRow);
}



// Adding events to document
for (let g = 0; g < allEvents.length; g++) {
	for (let e = 0; e < allEvents[g].events.length; e++) {
		for (let t = 0; t < allEvents[g].events[e].times.length; t++) {
			var individualEvent = allEvents[g].events[e];
			var individualEventTime = individualEvent.times[t];
			var eventElement = `
				<div
					class="event"
					guy="${allEvents[g].guy}"
					day="${individualEventTime.day}"
					start-time="${individualEventTime.startTime}"
					end-time="${individualEventTime.endTime}"
					style="background: ${individualEvent.bgColor}"
				>
					<div class="event-name">${individualEvent.name}</div>
					<div class="event-abbr">${individualEvent.abbr}</div>
					<div class="event-code">${individualEvent.code}</div>
					<div class="event-time">
						<span>${individualEventTime.startTime} - </span><span>${individualEventTime.endTime}</span>
					</div>
				</div>
			`;
			$(".schedule-wrapper").append(eventElement);
		}
	}
}
$(`.event[guy="shawn"]`).addClass("show-event");



// Pad number with zeros
function pad(num) {
	return String(num).padStart(2, "0");
}



// Function to convert 12-hour time to 24-hour time
function convertTo24(time) {
	var [time12h, meridiem] = time.split(" ");
	var [hour, minutes] = time12h.split(":");

	if (hour == "12") hour = "00";
	if (meridiem == "pm") hour = parseInt(hour) + 12;

	return pad(hour) + ":" + minutes;
}



// Function to size and place events on schedule
function placeEvents() {
	let hourHeight = $(".tr").outerHeight() - 2 * tableBorderSize;
	let hourWidth = $(".td").width();

	$(".event").each(function() {
		let day = $(this).attr("day");
		let startTime = $(this).attr("start-time");
		let endTime = $(this).attr("end-time");

		// Calculating how far down and left the event has to be
		let startHr = parseInt(startTime.split(" ")[0].split(":")[0]);
		let startMin = parseInt(startTime.split(" ")[0].split(":")[1]);
		let startMinProportion = startMin / 60;
		let startMeridiem = startTime.split(" ")[1];
		let startTd = $(`[day="${day}"][time="${startHr} ${startMeridiem}"]`);
		let topOffset = startTd.position().top + (hourHeight * startMinProportion) + tableBorderSize;
		let leftOffset = startTd.position().left;

		// Calculating height
		let msDuration =
			new Date("2003/12/15 " + convertTo24(endTime)) -
			new Date("2003/12/15 " + convertTo24(startTime));
		let hrDuration = msDuration / 1000 / 60 / 60;
		let extraBorderHeightMultiplier = Math.floor(hrDuration);
		if (Number.isInteger(hrDuration)) extraBorderHeightMultiplier -= 1;
		let smartEventHeight = (hourHeight * hrDuration) + (extraBorderHeightMultiplier * tableBorderSize);
		console.log(hrDuration);

		$(this).css({
			"top": topOffset,
			"left": leftOffset,
			"width": hourWidth,
			"height": smartEventHeight
		});
	});
}
placeEvents();

window.onresize = function() {
	placeEvents();
}



// On guy selection change
$(`input[name="guy"]`).change(function() {
	var $this = $(this);
	var guy = $(this).attr("id").replace("-guy", "");

	if ($this.is(":checked")) $(`.event[guy="${guy}"]`).addClass("show-event");
	else $(`.event[guy="${guy}"]`).removeClass("show-event");

	/* if ($(`input[name="guy"]:checked`).length >= 2) $(".event").addClass("overlaid-event");
	else $(".event").removeClass("overlaid-event"); */
});