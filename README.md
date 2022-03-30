# This branche is a test to get the valve data into a database

# ventiellijstenApp

This is a app for converting an export of valve values from the big farmnet computer. In a pdf document where adjustment of value a week can be written down by day. As is done a lot by farmers with a liquid products kitchen for pig.

## How to use the app

This is the explanation for how to use the app.

### export file from bigfarmnet

1. Open bigfarmnet manager (maby with any-desk)
2. Select Farm/Boerderij (Left)
3. click on the 3 pigs at the top
4. click on Manager at the left top and select expoteer. And save the file (opslaan button)
5. Open documents and copy the saved file

### use the ventielijstenApp

1. Save the file on the computer with the converter
2. Open the Ventiellijsten converter app
3. Click select file and select the saved file and press open
4. Click on select path and select folder documents
5. Press save, and ok. Close valve lists
6. Open the file and print

## How to setting up the export

Here you find a description for how to build the config file.

```jsonc
{
  "Bruneel-cox": [
    // the name where app gone search for the setting
    {
      // start of a page discription of a page
      "name": "Stal 4", // name of the building in bigframnet
      "fontSize": 9.1, // the size of each row
      "LafUp": true, // this parameter say to the afd counter of he must tell up or down at the left column. (true = up)
      "RafUp": true, // same as above but for the right column
      "VentPerAfd": 10, // number of valves of eatch department(afdeling)
      "LStartVent": 1, // left column start velve
      "LStartAfd": 40, // left column start department(afdeling)
      "LAantalAfd": 5, // number of departments(afdeinling) in the left column
      "RStartVent": 51, // right column start velve
      "RStartAfd": 45, // right column start department(afdeling)
      "RAantalAfd": 5 // number of departments(afdeinling) in the right column
    }, // end of a page, if you write a ',' than can you start with discription a new page
    {
      // start of the new page all the same of the file before
      "name": "Stal 5",
      "fontSize": 12,
      "LafUp": false,
      "RafUp": false,
      "VentPerAfd": 8,
      "LStartVent": 49,
      "LStartAfd": 61,
      "LAantalAfd": 3,
      "RStartVent": 73,
      "RStartAfd": 58,
      "RAantalAfd": 3
    }
  ]
}
```
