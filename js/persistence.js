	/**
	*  Folder to store Time App data files
	*
	*/
	
	var TIMEAPPFOLDER = 'TimeApp';
	var APPDATASIZE = 1*1024*1024;  // 1MB
    
    /**
    *  Check to determine if a memory card is present, and to verify the TimeApp data folder
    *
    */
    
    function checkAndCreateTimeAppFolder(onFailure) {
	  window.requestFileSystem(LocalFileSystem.PERSISTENT, APPDATASIZE, function (fileSystem) { 
        fileSystem.root.getDirectory(TIMEAPPFOLDER, {create: true}, function (dirEntry) {
    	}, onFailure); 
	  }, onFailure);    
    }
    
    /**
    *  Reads content of TimeApp folder. Passes array of files as parameter to onSuccess.
    *	
    */
    
    function readDirectoryEntries(onSuccess, onFailure) {
 	  window.requestFileSystem(LocalFileSystem.PERSISTENT, APPDATASIZE, function (fileSystem) { 
        fileSystem.root.getDirectory(TIMEAPPFOLDER, {create: true}, function (dirEntry) {
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(onSuccess, onFailure);        
    	}, onFailure); 
	  }, onFailure);       
    }

	/**
	*  Writes content to file
	* 
	*/
	
	function writefile(filename, content, onFailure) {
	  window.requestFileSystem(LocalFileSystem.PERSISTENT, APPDATASIZE, function (fileSystem) { // henter filsystem
        fileSystem.root.getFile(TIMEAPPFOLDER+"/"+filename+".json", {create: true}, function (fileEntry) {
          fileEntry.createWriter(function (writer) {
  		    writer.onwrite = function(evt) {
              console.log("write success");
        	};
        	console.log("Path " + fileEntry.fullPath);
        	writer.write(content);
    	  }, onFailure);
    	}, onFailure); 
	  }, onFailure);
    }
    
    /**
    *  Reads file as a text, string is passed on as arguemnt to the handler
    *
    */
    
    function readfile(filename, onSuccess, onFailure) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, APPDATASIZE, function (fileSystem) {
	        		fileSystem.root.getFile(TIMEAPPFOLDER+"/"+filename+".json", {create: true}, function (fileEntry) {
 		       		  fileEntry.file(function gotFile(file){
					    var reader = new FileReader();
					      reader.onloadend = function(evt) {
					        console.log("Read as text");
				    	    console.log(evt.target.result)
				        	onSuccess(reader.result);
				       	  };
				        reader.readAsText(file);
    				  }, onFailure);
    			  }, onFailure);
    		}, onFailure);

    }
