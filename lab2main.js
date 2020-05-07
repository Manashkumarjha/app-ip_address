/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const path = require('path');
 
/**
 * Import helper function module located in the same directory
 * as this module. IAP requires the path object's join method
 * to unequivocally locate the file module.
 */
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));
const IPCIDR = require('ip-cidr');

/**
 * Calculate and return the first host IP address from a CIDR subnet.
 * @param {string} cidrStr - The IPv4 subnet expressed
 *                 in CIDR format.
 * @param {callback} callback - A callback function.
 * @return {string} (firstIpAddress) - An IPv4 address.
 */
function getFirstIpAddress(cidrStr, callback) {

  // Initialize return arguments for callback
let firstIpAddress = null;
let callbackError = null;
let ipv6Address = null;
let callbackData = null;
//let abc=null;
//let def=null;
//var abc=ipv4;
//var def=ipv6;
  // Instantiate an object from the imported class and assign the instance to variable cidr.
  const cidr = new IPCIDR(cidrStr);
  // Initialize options for the toArray() method.
  // We want an offset of one and a limit of one.
  // This returns an array with a single element, the first host address from the subnet.
  const options = {
    from: 1,
    limit: 1
  };

  // Use the object's isValid() method to verify the passed CIDR.
  if (!cidr.isValid()) {
    // If the passed CIDR is invalid, set an error message.
    callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
  } else {
    // If the passed CIDR is valid, call the object's toArray() method.
    // Notice the destructering assignment syntax to get the value of the first array's element.
    
    [firstIpAddress] = cidr.toArray(options);
    ipv6Address = getIpv4MappedIpv6Address(firstIpAddress);
  }
 
 callbackData = "{" + JSON.stringify("ipv4") + ":" + JSON.stringify(firstIpAddress) + "," + JSON.stringify("ipv6")+":" + JSON.stringify(ipv6Address) + "}";
//var xyz=JSON.parse(callbackData);
var obj=JSON.stringify(callbackData);
console.log(obj);
//var obj=JSON.parse(callbackData);
 // callbackData = "{" + JSON.stringify(abc)+":" + JSON.stringify(firstIpAddress) + "," + JSON.stringify(def)+":" + JSON.stringify(ipv6Address) + "}";
 // abc=JSON.stringify(firstIpAddress);
  //def=JSON.stringify(ipv6Address);
//var data={
  //  "ipv4": abc,
    // "ipv6": def
      // };
 //console.log(JSON.stringify(ipv6Address));
//console.log(data);
  // Call the passed callback function.
  // Node.js convention is to pass error data as the first argument to a callback.
  // The IAP convention is to pass returned data as the first argument and error
  // data as the second argument to the callback function.
  return callback(JSON.parse(obj), callbackError);
}


/*
  This section is used to test function and log any errors.
  We will make several positive and negative tests.
*/
function main() {
  // Create an array of tests with both valid CIDR and invalid IP subnets.
  let sampleCidrs = ['172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.10.128/25', '192.168.1.216/30'];
  let sampleCidrsLen = sampleCidrs.length;

  // Iterate over sampleCidrs and pass the element's value to getFirstIpAddress().
  for (var i = 0; i < sampleCidrsLen; i++) {
    console.log(`\n--- Test Number ${i + 1} getFirstIpAddress(${sampleCidrs[i]}) ---`);
    // Call getFirstIpAddress and pass the test subnet and an anonymous callback function.
    // The callback is using the fat arrow operator: () => { }
    getFirstIpAddress(sampleCidrs[i], (data, error) => {
      // Now we are inside the callback function.
      // Display the results on the console.
      if (error) {
        console.error(`Error returned from GET request: ${error}`);
      } else {
        console.log(`Response returned from GET request: ${data}`);
      }
    });
  }
}

/*
  Call main to run it.
*/
main();