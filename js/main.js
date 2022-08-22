hours = [
	"8 am",
	"9 am",
	"10 am",
	"11 am",
	"12 am",
	"1 pm",
	"2 pm",
	"3 pm",
	"4 pm",
	"5 pm",
	"6 pm",
	"7 pm",
	"8 pm",
	"9 pm"
];

weekdays = [
	"sun",
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat"
];



// Looping through hours of the day
for (let h = 0; h < hours.length + 1; h++) {
	var dayDataString = "";

	// Looping through days of the week
	for (let w = 0; w < weekdays.length + 1; w++) {
		if (w == 0) dataInclude = hours[h - 1];
		else if (h == 0) dataInclude = weekdays[w - 1];
		else dataInclude = "";

		var dayData = `<td day="${weekdays[w - 1]}">${dataInclude}</td>`;
		dayDataString += dayData;
	}

	if (h == 0) hourRow = "<thead>" + dayDataString + "</thead>";
	else hourRow = `<tr time="${hours[h - 1]}">${dayDataString}</tr>`;

	$("table").append(hourRow);
}

$("td").eq(0).empty();



// Placing events on schedule
for (let e = 0; e < events.length; e++) {
	for (let t = 0; t < events[e].times.length; t++) {
		var eventVar = events[e].times[t];
		var eventElement = `
			<div
				class="event"
				day="${eventVar.day}"
				start-time="${eventVar.startTime}"
				end-time="${eventVar.endTime}"
				style="background: ${events[e].color}"
			>
				<div>${events[e].name}</div>
				<div>${eventVar.startTime} - ${eventVar.endTime}</div>
			</div>
		`;
		$("body").append(eventElement);
	}
}



// Function to pad time with a zero in front in needed
function pad(string, targetLength) {
	return string.padStart(targetLength, "0");
}



// Function to convert 12-hour time to 24-hour time
function convertTo24(time) {
	time = pad(time, 5);

	var [time12h, meridiem] = time.split(" ");
	var [hours, minutes] = time12h.split(":");

	if (hours == "12") hours = "00";
	if (meridiem == "pm") hours = parseInt(hours) + 12;

	return hours + ":" + minutes;
}



// Function to size and place events on schedule
function placeEvents() {
	var hourHeight = $("td").outerHeight();
	var hourWidth = $("td").outerWidth();

	$(".event").each(function() {
		var day = $(this).attr("day");
		var startTime = $(this).attr("start-time");
		var endTime = $(this).attr("end-time");

		var startHour = startTime.split(":")[0];
		var startMinutes = (startTime.split(":")[1]).split(" ")[0];
		var startMeridiem = (startTime.split(":")[1]).split(" ")[1];

		var endHour = endTime.split(":")[0];
		var endMinutes = (endTime.split(":")[1]).split(" ")[0];
		var endMeridiem = (endTime.split(":")[1]).split(" ")[1];

		var msDuration = Math.abs(
			new Date("2003/12/15 " + convertTo24(startHour + ":" + startMinutes)) -
			new Date("2003/12/15 " + convertTo24(endHour + ":" + endMinutes))
		);
		var hrDuration = msDuration / 1000 / 60 / 60;

		var topOffset = $(`tr[time="${startHour + " " + startMeridiem}"]`).offset().top;
		var leftOffset = $(`td[day="${day}"]`).offset().left;

		var smartEventHeight = hourHeight * hrDuration;
		if (hrDuration > 1) smartEventHeight += (Math.floor(hrDuration) * parseFloat($("table").css("--border")));

		$(this).css({
			"top": topOffset,
			"left": leftOffset,
			"height": smartEventHeight,
			"width": hourWidth
		});
	});
}
placeEvents();

window.onresize = function(event) {
	placeEvents();
}