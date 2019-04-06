define([
    'postmonger'
], function (
    Postmonger
) {
		'use strict';
			var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
	var payload = {};
	var eventDefinitionKey = '';
	var deFields = [];

	$(window).ready(function () {
		connection.trigger('ready');
		connection.trigger('requestInteraction');
	});

	function initialize (data) {
		if (data) {
			payload = data;
		}
	}

	function onClickedNext () {
		if (currentStep.key === 'idselection') {
			save();
		} else {
			connection.trigger('nextStep');
		}
	}

	function onClickedBack () {
		connection.trigger('prevStep');
	}

	function onGotoStep (step) {
		showStep(step);
		connection.trigger('ready');
	}

	function showStep (step, stepIndex) {
		if (stepIndex && !step) {
			step = steps[stepIndex - 1];
		}

		currentStep = step;

		$('.step').hide();

		switch (currentStep.key) {
		case 'eventdefinitionkey':
			$('#step1').show();
			$('#step1 input').focus();
			break;
		case 'idselection':
			$('#step2').show();
			$('#step2 input').focus();
			break;
		}
	}

	function requestedInteractionHandler (settings) {
		try {
			eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
			$('#select-entryevent-defkey').val(eventDefinitionKey);

			if (settings.triggers[0].type === 'SalesforceObjectTriggerV2' &&
					settings.triggers[0].configurationArguments &&
					settings.triggers[0].configurationArguments.eventDataConfig) {

				// This workaround is necessary as Salesforce occasionally returns the eventDataConfig-object as string
				if (typeof settings.triggers[0].configurationArguments.eventDataConfig === 'stirng' ||
							!settings.triggers[0].configurationArguments.eventDataConfig.objects) {
						settings.triggers[0].configurationArguments.eventDataConfig = JSON.parse(settings.triggers[0].configurationArguments.eventDataConfig);
				}

				settings.triggers[0].configurationArguments.eventDataConfig.objects.forEach((obj) => {
					deFields = deFields.concat(obj.fields.map((fieldName) => {
						return obj.dePrefix + fieldName;
					}));
				});

				deFields.forEach((option) => {
					$('#select-id-dropdown').append($('<option>', {
						value: option,
						text: option
					}));
				});

				$('#select-id').hide();
				$('#select-id-dropdown').show();
			} else {
				$('#select-id-dropdown').hide();
				$('#select-id').show();
			}
		} catch (e) {
			console.error(e);
			$('#select-id-dropdown').hide();
			$('#select-id').show();
		}
	}

	function save () {
		var campaignId = parseInt($("#camp").val());
            var title = $("#titl").val();
            var imageUrl = $("#imgurl").val();
            var message = $("#msg").val();
            var apikey = $("#apikey").val();
            var deepLinkKey = $("#deep").val();
            var deepLinkVal = $("#deepval").val();
            var channelId = parseInt($("#channel").val());
            var emailKey = $("#eml").val();
            //Validations
            if (title.trim() == "" || message.trim() == "" || apikey.trim() == "") {
                alert("Please fill all the required fields: Api Key, Message and Title.");
                return false;
            }
            if (channelId == "") {
                channelId = 1;
            }
            var contactEmail = "vernika.1295@gmail.com";
            if (deepLinkKey == "sri") {
                contactEmail = "srikant@useinsider.com";
            }

            payload["arguments"].execute.inArguments=[{
                "api_key":apikey,
                "emailKey":emailKey,
                "title":title,
                "message":message,
                "imageUrl":imageUrl,
                "deepLinkKey":deepLinkKey,
                "deepLinkVal":deepLinkVal,
                "channel_id":channelId,
                "camp_id":campaignId, 
                "emailAddress": "{{Contact.Attribute.Contact_Extension.EmailAddress}}"
            }];
            payload["metaData"]["isConfigured"]=true;
            console.log("Payload is -> "+payload);
            connection.trigger('updateActivity',payload);
		
		/*
		payload['arguments'] = payload['arguments'] || {};
		payload['arguments'].execute = payload['arguments'].execute || {};

		var idField = deFields.length > 0 ? $('#select-id-dropdown').val() : $('#select-id').val();

		payload['arguments'].execute.inArguments = [{
			'serviceCloudId': '{{Event.' + eventDefinitionKey + '.\"' + idField + '\"}}'
		}];

		payload['metaData'] = payload['metaData'] || {};
		payload['metaData'].isConfigured = true;

		console.log(JSON.stringify(payload));

		connection.trigger('updateActivity', payload);*/
	}

	connection.on('initActivity', initialize);
	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('gotoStep', onGotoStep);
	connection.on('requestedInteraction', requestedInteractionHandler);
});
