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
        console.log("New-> "+JSON.stringify(payload));
        var apiKey=payload["arguments"].execute.inArguments[0]["api_key"];
        var title=payload["arguments"].execute.inArguments[0]["title"];
        var message=payload["arguments"].execute.inArguments[0]["message"];
        var emailKey=payload["arguments"].execute.inArguments[0]["emailKey"];
        var imageUrl=payload["arguments"].execute.inArguments[0]["imageUrl"];
        var deepLinkKey=payload["arguments"].execute.inArguments[0]["deepLinkKey"];
        var deepLinkVal=payload["arguments"].execute.inArguments[0]["deepLinkVal"];
        var channelid=payload["arguments"].execute.inArguments[0]["channel_id"];
        var campid=payload["arguments"].execute.inArguments[0]["camp_id"];
        $("#camp").val(campid);
        $("#titl").val(title);
        $("#imgurl").val(imageUrl);
        $("#msg").val(message);
        $("#apikey").val(apiKey);
        $("#deep").val(deepLinkKey);
        $("#deepval").val(deepLinkVal);
        $("#channel").val(channelid);
        $("#eml").val(emailKey);
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
