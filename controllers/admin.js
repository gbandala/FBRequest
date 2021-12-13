var crypto = require('crypto');
const request = require('request');
const members = require( './members.json' );

function getUnixTime() {
    return (Date.now() / 1000) | 0;
}

function computeSHA256(lines) {
    var hash = crypto.createHash('sha256').update(lines, 'utf-8').digest('hex');
    return hash;
}

function validityUser(userId) {
    let valKeys = members.find(el => el.id === userId);
    if (valKeys.keys.active == true) {
        return valKeys;
    }
    else
        return false;
}

exports.requestAdd = function (req, res) {

    let Agent, Currency, Value;
    let sha = computeSHA256(req.body.em+ "");
    let test_event_code = req.body.test_event_code;
    if (req.body.client_user_agent == '') { Agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36" }
    else { Agent = req.body.client_user_agent }
    if (req.body.currency == '') { Currency = "USD" }
    else { Currency = req.body.currency }
    if (req.body.value == '') { Value = "0.00" }
    else { Value = req.body.value }

    let webhook = {
        data: [{
            event_name: req.body.event_name,
            event_time: getUnixTime(),
            event_source_url: req.body.event_source_url,
            event_id: req.body.event_id,
            action_source: 'website',
            user_data: {
                fbc: req.body.fbc,
                fbp: req.body.fbp,
                external_id: req.body.external_id,
                client_user_agent: Agent,
                em: sha,
                client_ip_address: req.body.client_ip_address,
            },
            custom_data: {
                currency: Currency,
                value: Value
            }
        }]
    };
    if (test_event_code != '') { webhook['test_event_code'] = test_event_code; }
    

   // res.json(webhook);
    let values = validityUser(req.body.external_id);
    if (values != false) {

        var url = 'https://graph.facebook.com/v12.0/' + values.keys.pixel + '/events?access_token=' + values.keys.token;
        var options = {
            'method': 'POST',
            'url': url,
            'headers': { 'Content-Type': 'application/json' }, 
            'body': JSON.stringify(webhook),
           
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            if (response.body) {
                // console.log(response.body);   
                res.json(response.body);
            }
        });

    }
    else    res.json('Usuario inactivo');
}




