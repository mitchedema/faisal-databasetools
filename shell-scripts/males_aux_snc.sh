#!/bin/bash

# Send message if user does not input a file path
if [ $# -eq 0 ]; then
	echo "error: Please specify a directory to save the CSV file"
	exit 1
fi

fpath=$1
# Determine absolute path from path input by user
fullpath="$(realpath $fpath)"
# Replace the $HOME path with a ~ for display
fullpathd="${fullpath/$HOME/'~'}"
# If directory does not exist, send error message and exit
if [ ! -d "$fpath" ]; then
	echo "error: $fullpathd: Directory does not exist"
	exit 1
fi

# File name for particular wrapper
fname="males_aux_snc.csv"
# Path to save output of query as a CSV
savepath="$fullpath/$fname"
# Path to display to user where file was saved
savepathd="$fullpathd/$fname"

#### Fields to be returned in select ####
fields="SUBJECTID, VISCODE, AGE, SEX, DX_STRATIFICATION, FLDSTRNG, APOE4, APOE2, APOE3, MMSE, CDRSB, ADAS11, ADAS13"
# Primary table being queried
table="SUBJECT"

#### Name of dataset to be queried ####
dataset="ADNI"
# Subquery to find id of desired dataset
datasetsubq="SELECT DATASET.ID FROM DATASET WHERE DATASET.NAME = '$dataset'"
# Condition for query to select data from specified dataset
datasetcond="SUBJECT.DATASETID = ($datasetsubq)"

#### Condition to be exectued in query ####
condition="SEX = 'Male' AND DX_STRATIFICATION = 'sNC'"
# Joining VISIT data for remaining fields of select statement
join="INNER JOIN VISIT ON VISIT.SUBJECTID = SUBJECT.ID"

# Formulating final query to be executed 
query="SELECT $fields FROM $table $join WHERE $condition AND $datasetcond;"

# Calling psql and setting search path to execute query and save output CSV to $savepath
searchpath="alzheimer"
dbname="faisalcids"
psql "dbname=$dbname options=--search_path=$searchpath" -P footer -b -A -F "," -o "$savepath" -c "$query"

# If psql completes with no error, notify user that CSV was saved and where it is located
if [ $? -eq 0 ]; then
	echo "CSV file saved to: $savepathd"
fi
