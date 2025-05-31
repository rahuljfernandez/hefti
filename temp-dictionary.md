# Temp File Data Dictionary

The uploaded temp file contains a lot of the data we are going to need going forward with a consistent data structure, i.e., the queries we write on this temp file will likely not have to change when we have the final file. I have subsetted the data to only include observations from 2022 and the rows of the data represent facility observations. You will immediately notice that each facility has duplicated facility-year observations - this is owing to variables/columns with the title "CMS_". For the CMS variables pertaining to ownership, there are multiple owners with different ownership types, percentages, and names (only for the CMS columns). Thus, when querying any other variable, the query for a single facility would need to seek a unique value from any other column, say, "Occupancy_Percent" as that value will be the same for all the facilities observations in 2022. Querying any "CMS_" variable would result in multiple values returned.

## Variables

- CCN: This is the entry point to any given facility, i.e., it's unique identification number. 

- Year: Year of the data observation

- Name: Name of the facility

- Ownership Type: Type of facility ownership, i.e, for-profit, not-for-profit, etc

- Is Chain: Binary indicator for whether the facility is chain owned

- Chain Name: Name of the chain owner, if any

- Parent Company Name: Name of the parent organization that owns the facility, if any

- Chain Indicator: Same as Is Chain

- REIT Name: REIT Owner Name, if any

- PE Name: PE Owner Name, if any

- Is REIT: Binary REIT ownership indicator

- Is PE: Binary PE ownership indicator

- REIT Acquisition Year: Year the facility was acquired by a REIT, if acquired

- PE Acquisition Year: Year the facility was acquired by PE, if acquired

- CMS Ownership Role: Role of CMS listed owner

- CMS Ownership Type: Type of CMS listed owner

- CMS Ownership Name: Name of CMS listed owner

- CMS Ownership Percentage: Percentage of CMS listed owner

- Address: Facility address

- City: Facility city

- State: Facility state

- Health Deficiencies: Number of health deficiencies at the facility

- Chain Size: Size of chain, if part of chain

- Number of Residents

- Number of Beds

- Certification Date

- Resident Average Age

- Resident Percent White

- Resident Percent Black

- Resident Percent White

- Resident Percent Female

- Resident Percent Mediciad

- Resident Percent Medicare

- Resident Percent Hispanic

- Is Hospital Based: Binary indicator for the facility being based in a hospital or not

- Occupancy Percentage

- Accuity Index

- RN Hours per Resident Day

- LPN Hours per Resident Day

- CNA Hours per Resident Day

- Overall Rating

- Quality Rating

- Staffing Rating

- Health Inspection Rating

- Number of Fines

- Total Amount of Fines in USD

- Total Penalties


## Sample Queries


For any queries on variables that are not CMS ownership variables, i.e., those variables having only one unique value per facility-year, some sample quesries may look like:

```
CREATE VIEW Facility_Info_2022 AS
SELECT DISTINCT
    CCN,
    Name,
    Occupancy_Percent,
    ...
    Total_Penalties
FROM data
WHERE Year == 2022 AND CCN == '1234567890';
```

If any of the CMS ownership information is required, then we can use queries like:

```
SELECT
    CMS_Ownership_Role,
    CMS_Ownership_Type,
    CMS_Ownership_Name,
    CMS_Ownership_Percentage
FROM data
WHERE Year == 2022 AND CCN == '1234567890'
```






































































