# Scripts files for GDevelop

* **ReleaseProcedure.bat**: this script compiles, generate documentation (see **GenerateAllDocs.bat**) and package GDevelop for Windows in an installer and an archive.
* **ReleaseProcedure.sh**: compiles and package GD for Ubuntu (see *Binaries/Packaging*).
* **CopyWindowsToLinuxReleaseFiles.sh**: Copy all files in *Binaries/Output/Release_Windows* to *Binaries/Output/Release_Linux*. Call it after any change in *Binaries/Output/Release_Windows*.
* **GenerateAllDocs.[bat|sh]**: Call doxygen and yuidoc to generate all the documentations into *docs* folder.
* **ExtractTranslations.[bat|sh]**: Create the *source.pot* file containing the strings to be translated using [Crowdin](https://crowdin.com/project/gdevelop).
