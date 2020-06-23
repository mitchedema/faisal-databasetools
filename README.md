**Host code for command line/BASH tools for querying databases.**

# BASH Wrappers

BASH wrappers are run from the terminal and execute predefined queries to the database. Output is then stored in a pre-named CSV file located where the user has specified (see [execution](#execution))

## List of current BASH wrappers:
- `females_aux_snc.sh`
    - Queries all records that are female, and have an AUX.STRATIFICATION of sNC 
- `females_aux_sdat.sh`
    - Queries all records that are female, and have an AUX.STRATIFICATION of sDAT
- `males_aux_snc.sh`
    - Queries all records that are male, and have an AUX.STRATIFICATION of sNC 
- `males_aux_sdat.sh`
    - Queries all records that are male, and have an AUX.STRATIFICATION of sDAT
- `all_aux_snc.sh`
    - Queries all records that have an AUX.STRATIFICATION of sNC
- `all_aux_sdat.sh`
    - Queries all records that have an AUX.STRATIFICATION of sDAT
- `all_females.sh`
    - Queries all records that are female
- `all_males.sh`
    - Queries all records that are male
- `all_records.sh`
    - Queries all records

**Columns that are returned for each query:** `SUBJECTID, VISCODE, AGE, SEX, DX_STRATIFICATION, FLDSTRNG, APOE4, APOE2, APOE3, MMSE, CDRSB, ADAS11, ADAS13`

## Execution
`bash /path/to/wrapper/{wrapper_name}.sh path/to/output/dir`

After execution, query output will be stored in a pre-named CSV file at path/to/output/dir