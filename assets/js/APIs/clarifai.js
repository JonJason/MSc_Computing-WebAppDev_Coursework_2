/**
 * ticketmaster.com API
 */
var API = (function(parent){

    var apiKey = "fd42b0a9954b4d3fbbd2360c433b6c8b";

    var predictionModel = { // model of prediction
        general: "aaa03c23b3724a16a56b629203edc62c" // general model, for predicting objects in a picture
    };

    var clarifaiApp = new Clarifai.App({
        apiKey: apiKey
    });

    var responseExample = [
        {id: "ai_MnBdTFRf", name: "template", value: 0.97977096, app_id: "main"},
        {id: "ai_LmHwzfMd", name: "layout", value: 0.96254706, app_id: "main"},
        {id: "ai_FbMs5Fms", name: "presentation", value: 0.9453901, app_id: "main"},
        {id: "ai_M7TvgbrL", name: "page", value: 0.91061944, app_id: "main"},
        {id: "ai_K6dHqzgm", name: "banner", value: 0.90502614, app_id: "main"},
        {id: "ai_p9bzR7fH", name: "education", value: 0.90167296, app_id: "main"},
        {id: "ai_42Dl0Qrd", name: "number", value: 0.90131253, app_id: "main"},
        {id: "ai_LWk33jmF", name: "booklet", value: 0.8933984, app_id: "main"},
        {id: "ai_6lhccv44", name: "business", value: 0.8917139, app_id: "main"},
        {id: "ai_TbGNfjXx", name: "time", value: 0.8690983, app_id: "main"},
        {id: "ai_j6hStGZl", name: "information", value: 0.8675124, app_id: "main"},
        {id: "ai_WCsfx0Ft", name: "World Wide Web", value: 0.8602122, app_id: "main"},
        {id: "ai_nBdfNKHg", name: "company", value: 0.8548329, app_id: "main"},
        {id: "ai_5NvRrw97", name: "facts", value: 0.84448063, app_id: "main"},
        {id: "ai_TPsBgh8g", name: "procedure", value: 0.8444006, app_id: "main"},
        {id: "ai_hSgFm2Bt", name: "set", value: 0.8405048, app_id: "main"},
        {id: "ai_w3fmkZRk", name: "order", value: 0.8366505, app_id: "main"},
        {id: "ai_gVWgzkJz", name: "conceptual", value: 0.8180785, app_id: "main"},
        {id: "ai_M78jFpM2", name: "text", value: 0.81802213, app_id: "main"},
        {id: "ai_1VSx3n1w", name: "card", value: 0.8154363, app_id: "main"}
    ];

	var api = function () {};

    api.prototype.getPrediction = function(filepath, callback) {
        callback && callback(responseExample);
        return;

        clarifaiApp.models.predict(predictionModel.general, filepath).then(
            function(response) {
                callback && callback(response.outputs[0].data.concepts);
            },
            function(err) {

            }
        );
    };


    parent.clarifai = new api();

	return parent;
})(API || {});
