const fs = require('fs');
const pdf = require('pdf-parse');
 
let get_MPAN = function(){
    if ( process.argv.length != 3 ){
        console.log(`Input PDF bill required! E.g. ${__filename} your_pdf.pdf`);
        process.exit(-1);
    }

    const file_name = process.argv[2];

    fs.readFile(file_name, (err, raw_buffer)=>{
        if (err){
            console.log(`File not found: ${err}`);
        }
        
        pdf(raw_buffer).then((data)=>{
            
            const MPAN_REGEX = /[\w]{1}\ [\d| ]{27}/;
            let to_parse = data.text;
            let MPAN_code;

            let result = to_parse.match(MPAN_REGEX);
                
            if (result) MPAN_code = result[0];

            if (MPAN_code){
                console.log(`MPAN code: ${MPAN_code}`);
            } else {
                console.log(`MPAN not found in ${file_name}`);
            }
    
        }).catch((error)=>{
            console.log(`Something went wrong in parsing! Is really a (correct) PDF? Error: ${error}`);
        });
    
    })
}(); 
    