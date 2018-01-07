/**
 * clarifai.com API
 */
var API = (function(parent){

    var apiKey = "fd42b0a9954b4d3fbbd2360c433b6c8b";

    var predictionModel = { // model of prediction
        general: "aaa03c23b3724a16a56b629203edc62c" // general model, for predicting objects in a picture
    };

    var clarifaiApp = new Clarifai.App({
        apiKey: apiKey
    });

	var api = function () {};

    api.prototype.getPrediction = function(filepath, callback) {

        clarifaiApp.models.predict(predictionModel.general, filepath).then(
            function(response) {
                console.log(JSON.stringify(response.outputs[0].data.concepts));
                callback && callback(response.outputs[0].data.concepts);
            },
            function(err) {

            }
        );
    };


    parent.clarifai = new api();

	return parent;
})(API || {});
