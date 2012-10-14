/////////////////// Form Fields Display /////////////////////////////////////////////////////
function toggleDiv(elementName, parent) {
    var e = document.getElementById(elementName);
    if (e) {
        if ((e.style.display != 'block')) {
            e.style.display = 'block'; 
            e.style.position = "absolute";
            e.style.zIndex = "1";
            e.style.top = findPosY (parent) + 30 + "px";
            e.style.left = findPosX (parent) - 600 + "px";
        } else {
            e.style.display = 'none'; 
        }
    }
}

function toggleBlock(elementName) {
    var e = document.getElementById(elementName);
    if (e) {
        if ((e.style.display != 'block')) {
            e.style.display = 'block'; 
        } else {
            e.style.display = 'none'; 
        }
    }
}  

function findPosX(obj) {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) {
        curleft += obj.offsetLeft;
        if(!obj.offsetParent)
            break;
        obj = obj.offsetParent;
    } else if(obj.x) curleft += obj.x;
    return curleft;
}

function findPosY(obj)  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)  {
            curtop += obj.offsetTop;
            if(!obj.offsetParent)
                break;
            obj = obj.offsetParent;
    } else if(obj.y)   curtop += obj.y;
    return curtop;
}
       
function cloneRow(id){
    var node = document.getElementById(id);
     var clone = node.cloneNode(true);
    insertAfter (node, clone);
    crawlNode(clone, id);
}

function insertAfter(ref, node) {
    ref.parentNode.insertBefore(node, ref.nextSibling);
}


function parentContainer (node, level) {
    while (level > 0) {
        level = level - 1;
        return parentContainer (node.parentNode, level);
    }
    return node;
}

function crawlNode(node, idPrefix) {      
    if (node.id) {
            node.id =  indexPlus (node.id, idPrefix);
    } else if (node.name) {
        node.name =  indexPlus (node.name, idPrefix);
    }
   
    if(node.hasChildNodes()) {  
        for(var i=0; i<node.childNodes.length; i++) {   
            crawlNode(node.childNodes[i], idPrefix);
        }                                   
    }                                           
}

function indexPlus (id, prefix) {
    return buldIndexName (id, prefix, 1);
}

function indexMinus (id, prefix) {
    return buldIndexName (id, prefix, -1);
}

function buldIndexName(id, prefix, num) {
    var index = parseInt(extractIndex(prefix));
    var newIndex = index + parseInt(num);
    var name = extractName(prefix);
    return id.replace (prefix, name + "" + (newIndex) + ""); 
    
}

function hideAddDelete(id) {
    
     var addNode = document.getElementById(id + ".Add");
     var deleteNode = document.getElementById(id + ".Delete");
     addNode.style.display = 'none';
     deleteNode.style.display = 'none';
     
     var previousNodeId =  indexPlus (id, id);
     var previousDeleteNode = document.getElementById(previousNodeId + ".Delete");
     previousDeleteNode.style.display = '';
}

function extractIndex (id) {
    var match = /([0-9]+)$/i.exec(id);
    return match[1];
}

function extractName (id) {
    var match = /^(\S+)[0-9]+$/i.exec(id);
    return match[1];
}

function showAddDelete(id) {
    
    if (isFirstIndex(id)) {
        var deleteNode = document.getElementById(id + ".Delete");
        deleteNode.style.display = '';
        return;
     }
    var previousNodeId =  indexMinus (id, id);
    var addNode = document.getElementById(previousNodeId + ".Add");
    var deleteNode = document.getElementById(previousNodeId + ".Delete");
    addNode.style.display = '';
    deleteNode.style.display = '';
    
}

function deleteRow(id){
    if (isFirstIndex(id)) return;
    var node = document.getElementById (id);
      node.parentNode.removeChild(node);
}

function isFirstIndex(id) {
     var match = /([0-9]+)$/i.exec(id);
     return match != null && match[1] != null && match[1] == 1;
}


function deleteContainer(node, parentLevel) {
    var parent = parentContainer(node, parentLevel);
    deleteRow(parent.id);
    showAddDelete(parent.id);
    return false;
}

function addContainer(node, parentLevel) {
    var parent = parentContainer(node, parentLevel);
    cloneRow(parent.id);
    hideAddDelete(parent.id);
    return false;
}


/////////////////// Auth /////////////////////////////////////////////////////
Date.prototype.toISODate =
        new Function("with (this)\n    return " +
           "getFullYear()+'-'+addZero(getMonth()+1)+'-'" +
           "+addZero(getDate())+'T'+addZero(getHours())+':'" +
           "+addZero(getMinutes())+':'+addZero(getSeconds())+'.000Z'");

function addZero(n) {
    return ( n < 0 || n > 9 ? "" : "0" ) + n;
}

function getNowTimeStamp() {
    var time = new Date();
    var gmtTime = new Date(time.getTime() + (time.getTimezoneOffset() * 60000));
    return gmtTime.toISODate() ;
}

function ignoreCaseSort(a, b) {
    var ret = 0;
    a = a.toLowerCase();
    b = b.toLowerCase();
    if(a > b) ret = 1;
    if(a < b) ret = -1;
    return ret;
}

function generateV1Signature(url, key) {
        var stringToSign = getStringToSign(url);
        var signed =   b64_hmac_sha1(key, stringToSign);
        return signed;
}

/////////////////// String To Sign /////////////////////////////////////////////////////
function getStringToSign(url) {

    var stringToSign = "";
    var query = url.split("?")[1];

    var params = query.split("&");
    params.sort(ignoreCaseSort);
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split("=");
        var name =   param[0];
        var value =  param[1];
        if (name == 'Signature' || undefined  == value) continue;
            stringToSign += name;
            stringToSign += decodeURIComponent(value);
         }

    return stringToSign;
}

/////////////////// Signed URL /////////////////////////////////////////////////////
function generateSignedURL(actionName, form, accessKeyId, secretKey, endpoint, version) {
   console.log(actionName+"  "+form+"  "+accessKeyId+"  "+secretKey+"  "+endpoint+"  "+version);
   var url = endpoint + "?SignatureVersion=1&Action=" + actionName + "&Version=" + encodeURIComponent(version) + "&";
   for (var i = 0; i < form.elements.length; ++i) {
           var elementName = form.elements[i].name;
        
        var elementValue = null;
    
           if (form.elements[i].type == 'text') {
            elementValue = form.elements[i].value;
        } else if (form.elements[i].type == 'select-one') {
            elementValue = form.elements[i].options[form.elements[i].selectedIndex].value;
        }    
        if (elementValue) {
                   url += elementName;
                   url += "=";
                   url += encodeURIComponent(elementValue);
                   url += "&";
        }
   }
   var timestamp = getNowTimeStamp();
   url += "Timestamp=" + encodeURIComponent(timestamp);
   
   url += "&AWSAccessKeyId=" + encodeURIComponent(accessKeyId);
   var signature = generateV1Signature(url, secretKey);
   url += "&Signature=" + encodeURIComponent(signature); 
   
   return url;
}
/////////////////// Signed URL by Kanika /////////////////////////
function generateMySpecialSignedURL(actionName,cloud,accessKeyId, secretKey, endpoint, version) {
   //console.log(actionName+"  "+accessKeyId+"  "+secretKey+"  "+endpoint+"  "+version);
   var url = endpoint + "?SignatureVersion=1&Action=" + actionName + "&Version=" + encodeURIComponent(version) + "&";
   /////
   //console.log('inside special signing');


                            $.each(cloud, function(key, value) 
                            { 
                            console.log(key + ': ' + value); 
                            url += key;
                            url += "=";
                            url += encodeURIComponent(value);
                            url += "&";
                            });
   console.log("%%%%%"+url);
                               /////
   var timestamp = getNowTimeStamp();
   url += "Timestamp=" + encodeURIComponent(timestamp);
   
   url += "&AWSAccessKeyId=" + encodeURIComponent(accessKeyId);
   var signature = generateV1Signature(url, secretKey);
   url += "&Signature=" + encodeURIComponent(signature);
  var newurl=url.replace("AvailabilityZone","Placement.AvailabilityZone").replace("SecurityGroup","SecurityGroup.01");
  console.log("new URL"+newurl); 
   
   return url;
}



function generateMySignedURL(actionName,accessKeyId, secretKey, endpoint, version) {
  // console.log(actionName+"  "+accessKeyId+"  "+secretKey+"  "+endpoint+"  "+version);
   var url = endpoint + "?SignatureVersion=1&Action=" + actionName + "&Version=" + encodeURIComponent(version) + "&";
   var timestamp = getNowTimeStamp();
   url += "Timestamp=" + encodeURIComponent(timestamp);
   
   url += "&AWSAccessKeyId=" + encodeURIComponent(accessKeyId);
   var signature = generateV1Signature(url, secretKey);
   url += "&Signature=" + encodeURIComponent(signature); 
   
   return url;
}



/////////////////// Build Form Fields /////////////////////////////////////////////////////
function getFormFieldsFromUrl (url)
     {
    var fields  = "";
    var query = url.split("?")[1];
    var params = query.split("&");
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split("=");
        var name =   param[0];
        var value =  param[1];
         fields += "<input type=\"hidden\" name=\""+name+"\" value=\""+decodeURIComponent(value)+"\">";
    }
    return fields;
}