var hours = [
	"7 am",
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
	var dayDataString = "";

	// Looping through days of the week
	for (let w = 0; w < weekdays.length + 1; w++) {
		if (w == 0) dataInclude = hours[h];
		else dataInclude = "";

		var dayData = `<td day="${weekdays[w - 1]}"><span>${dataInclude}</span></td>`;
		dayDataString += dayData;
	}

	hourRow = `<tr time="${hours[h]}">${dayDataString}</tr>`;

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
					style="background: ${individualEvent.color}"
				>
					<div class="event-name">${individualEvent.name}</div>
					<div class="event-time">
						${individualEventTime.startTime} - <span>${individualEventTime.endTime}</span>
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
	var hourHeight = $("tr").outerHeight();
	var hourWidth = $("td").outerWidth();

	$(".event").each(function() {
		var day = $(this).attr("day");
		var startTime = $(this).attr("start-time");
		var endTime = $(this).attr("end-time");

		// Calculating how far down and left the event has to be
		var firstRecordedHour = hours[0].slice(0, 1) + ":00" + hours[0].slice(1);
		var msStartBuffer =
			new Date("2003/12/15 " + convertTo24(startTime)) -
			new Date("2003/12/15 " + convertTo24(firstRecordedHour));
		var hrStartBuffer = msStartBuffer / 1000 / 60 / 60;
		var extraBorderBufferMultiplier = Math.floor(hrStartBuffer) + 1;
		var topOffset = (hrStartBuffer * hourHeight) + (extraBorderBufferMultiplier * tableBorderSize);
		var leftOffset = $(`td[day="${day}"]`).offset().left;

		// Calculating height/length of event
		var msDuration =
			new Date("2003/12/15 " + convertTo24(endTime)) -
			new Date("2003/12/15 " + convertTo24(startTime));
		var hrDuration = msDuration / 1000 / 60 / 60;
		var extraBorderHeightMultiplier = Math.floor(hrDuration);
		if (Number.isInteger(hrDuration)) extraBorderHeightMultiplier -= 1;
		var smartEventHeight = (hourHeight * hrDuration) + (extraBorderHeightMultiplier * tableBorderSize);

		$(this).css({
			"top": topOffset,
			"left": leftOffset,
			"height": smartEventHeight,
			"width": hourWidth
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