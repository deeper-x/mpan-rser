## Brief description ##
The function required is in index.js.


Simply calling
```shell
$ node index.js path/to/pdf
```

Invoking that function (passing input PDF as mandatory parameter), the IIFE first process
the argument, and if it's found, call the the filesystem readFile (async, and without encoding, so it return raw buffer).
ReadFile's callback takes (as usual) the error (handling it), and the buffer, passing it to the pdf-parser
object, which is called in a Promise "chain" (defined as promise_obj.then(...).catch(...)). 
This allows to handle it asynchronously, "dealing with rejected cases only" (as documentation says).
Inside the .then() promise, the anonymous callback read buffer and search for a MPAN string.
That string, is a sequence of 27 digits/spaces, that start with a single letter 'S'. 
So we have 7 blocks:
* S (It's a Supply number MPAN, not a MPRN) 
* PC (00..08)
* MTC (001..999)
* LLFC (3 digit numeric, until 30/06/2016, then became 3 alphanum)
* CORE (13 digits) 
* DISTR ID (10..32)
* CHECK (a checksum based on DISTR ID)

That string is usually filled in a box, and best option to get it seems to be 
* extracting whole text from pdf
* searching for a match  


Fetching that string, we can have, for example:
* S 902 01 801 12 0005 1808 366
* S 01 801 001 11 6000 1208 212

we see that length is the same, and internal blocks order may change (PDF are built/drawn in different ways...).
The fixed elements seem to be:
* space-"S"-space at the beginning
* a 27 length sequence of digits and/or spaces. The only unsure element is the LLFC: can be alphanum? 
* a final space

Coming back to the code description, for now we check that "raw string": if founded is returned as a console.log result 
(of course, in a next release could be useful to store it).


In the next releases, I would also work on:
* LLFC: if can be alphanum, regexp must be updated
* a string "format check". All of these "blocks" seem to have a defined and unique range and length, so it would be useful to implement a function (maybe a Class) with dedicated check and reading method. This can be useful if -in the future- we want to store informations that blocks' string give us.
* a massive-parser: a PDF directory scan service (given N new PDF, it'll get MPAN codes, in batch/cron or manually)
* a REST service: for a given document, consumer will get MPAN code simply calling exposed functionalities
* identification of similar sequences that could give us useful informations, and deploy of similar functionalities (maybe with a Parent class with the generalized functionalities, and childs that implement their own specialization)   


