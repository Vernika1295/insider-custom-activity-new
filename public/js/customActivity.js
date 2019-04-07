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
        alert("hey man");
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
            console.log("Payload is -> "+JSON.stringify(payload));
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
	connection.on('clickedNext', save);
});
