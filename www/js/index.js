
var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    this.receivedEvent('deviceready');

    initExampleUi();
    initScanbotSdk();
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }

};

app.initialize();



var currentDocumentImage = { imageFileUri: '', originalImageFileUri: '' };

var demoLicenseKey = "TPSiQ+xEtoOSBoBMrXe/hcLDSnxRn4" +
    "mSDTBj9pLXjvkPrTEPQg1F9uSgINSb" +
    "P4FieC6SqCVtgA8Z4OaOawowJlHQCg" +
    "BFTEQvSPBc5anNX6SeyLagoXXDQTo8" +
    "i5Dnb+qcVvzxYnryklt0w9SStzxnPG" +
    "nUuxJLDcKfF4nBEtC6ZLByjjPg5rFo" +
    "wGZ8PQ4We5AUKtlP0F0i0llsgQ3tzD" +
    "WtHc2iavKBsZ5RxSgLET18KTwKQECN" +
    "7njJsgQ/qrORcfZX49r9Cb7R2JX34b" +
    "GzM8sRYx7LMIThkqt75PTbV6CkHqhN" +
    "TIv3+VHeaQ2CXz7+j6Fl71LG+a3pdJ" +
    "UCG5UL7qbbbA==\nU2NhbmJvdFNESw" +
    "ppby5zY2FuYm90LmV4YW1wbGUuc2Rr" +
    "LmNvcmRvdmEKMTQ5ODM0ODc5OQo5NA" +
    "oz\n";

function initExampleUi() {
  document.getElementById('start-camera-ui-button').onclick = function(e) {
    startCameraUi();
  };
  document.getElementById('start-cropping-ui-button').onclick = function(e) {
    startCroppingUi();
  };
  document.getElementById('apply-image-filter-button').onclick = function(e) {
    applyImageFilter();
  };
}

function initScanbotSdk() {
  var options = {
    loggingEnabled: true,
    licenseKey: demoLicenseKey
  };

  ScanbotSdk.initializeSdk(
      function(result) {
        console.log(result);
        document.getElementById('label-ready').innerHTML = '' + result;
      },
      sdkErrorCallback, options
  );
}

function sdkErrorCallback(error) {
  console.log('Error from Scanbot SDK: ' + error);
  alert('Error from Scanbot SDK: ' + error);
}

function startCameraUi() {
  var options = {
    edgeColor: '#0000ff',
    quality: 70,
    sampleSize: 2 // change to 1 for full resolution images
  };

  ScanbotSdkUi.startCamera(
      function(result) {
        console.log('Camera result: ' + JSON.stringify(result));
        setCurrentDocumentImage(result);
      },
      sdkErrorCallback, options
  );
}

function startCroppingUi() {
  if (!currentDocumentImage.originalImageFileUri) {
    alert('Please snap an image via Camera UI.');
    return;
  }

  var options = {
    imageFileUri: currentDocumentImage.originalImageFileUri,
    edgeColor: '#0000ff',
    quality: 70
  };

  ScanbotSdkUi.startCropping(
      function(result) {
        console.log('Cropping result: ' + JSON.stringify(result));
        setCurrentDocumentImage(result);
      },
      sdkErrorCallback, options
  );
}

function applyImageFilter() {
  if (!currentDocumentImage.imageFileUri) {
    alert('Please snap an image via Camera UI.');
    return;
  }

  var options = {
    imageFileUri: currentDocumentImage.imageFileUri,
    imageFilter: ScanbotSdk.ImageFilter.BINARIZED,
    quality: 70
  };

  ScanbotSdk.applyImageFilter(
      function(result) {
        console.log('Image filter result: ' + JSON.stringify(result));
        setCurrentDocumentImage(result);
      },
      sdkErrorCallback, options
  );
}


function setCurrentDocumentImage(sdkResult) {
  if (hasField(sdkResult, 'imageFileUri') && sdkResult.imageFileUri) {
    currentDocumentImage.imageFileUri = sdkResult.imageFileUri;
  }
  if (hasField(sdkResult, 'originalImageFileUri') && sdkResult.originalImageFileUri) {
    currentDocumentImage.originalImageFileUri = sdkResult.originalImageFileUri;
  }
  if (currentDocumentImage.imageFileUri !== '') {
    document.getElementById('image-result').setAttribute('src', currentDocumentImage.imageFileUri);
  }
}

function hasField(obj, fieldName) {
  return Object.keys(obj).indexOf(fieldName) != -1;
}
