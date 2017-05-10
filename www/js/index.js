
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
    licenseKey: ''
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
