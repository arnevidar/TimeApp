	/**
	*  Folder to store Time App data files
	*   TODO fix local variables
     *  TODO fix race condition, so phonegap can load before window.requestFileSystem is used
	*/
	function Persistence () {
        this.TIMEAPPFOLDER = "TimeApp";
        this.APPDATASIZE = 1*1024*1024;
    }

    /**
    *  Check to determine if a memory card is present, and to verify the TimeApp data folder
    *
    */
    
    Persistence.prototype.checkAndCreateTimeAppFolder = function (onSuccess, onFailure) {
	  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("TimeApp", {create: true}, function (dirEntry) {
            onSuccess();
    	}, onFailure); 
	  }, onFailure);        
    }
    
    /**
    *  Reads content of TimeApp folder. Passes array of files as parameter to onSuccess.
    *	
    */
    
    Persistence.prototype.readDirectoryEntries = function (onSuccess, onFailure) {
 	  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("TimeApp/", {create: true}, function (dirEntry) {
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(onSuccess, onFailure);        
    	}, onFailure); 
	  }, onFailure);       
    }

	/**
	*  Writes content to file
	* 
	*/
	
    Persistence.prototype.writefile = function (filename, content, onSuccess, onFailure) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { // henter filsystem
          fileSystem.root.getFile("TimeApp"+"/"+filename+".json", {create: true}, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
			  writer.onwrite = function(evt) {
              onSuccess();
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
    
    Persistence.prototype.readfile = function (filename, onSuccess, onFailure) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
	        		fileSystem.root.getFile("TimeApp"+"/"+filename+".json", {create: true}, function (fileEntry) {
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
