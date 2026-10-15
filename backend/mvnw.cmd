@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements. See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership. The ASF licenses this file to you under
@REM the Apache License, Version 2.0 (the "License"); you may not use this
@REM file except in compliance with the License. You may obtain a copy of
@REM the License at
@REM
@REM https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
@REM implied. See the License for the specific language governing
@REM permissions and limitations under the License.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET __ MVNW_CMD__=
@SETLOCAL

@REM ==== START VALIDATION ====
@IF NOT "%JAVA_HOME%"=="" GOTO OkJHome
@FOR %%i IN (java.exe) DO @SET "JAVACMD=%%~$PATH:i"
@GOTO OkJHome

:OkJHome
@IF NOT "%JAVA_HOME%"=="" SET "JAVACMD=%JAVA_HOME%\bin\java.exe"

@IF EXIST "%JAVACMD%" GOTO execute

@ECHO.
@ECHO Error: JAVA_HOME is not defined correctly.
@ECHO   JAVA_HOME = "%JAVA_HOME%"
@ECHO.
@GOTO error

:execute
@SET MAVEN_PROJECTBASEDIR=%~dp0
@SET MAVEN_BASEDIR=%MAVEN_PROJECTBASEDIR%
@IF NOT "%MAVEN_BASEDIR%"=="" GOTO baseDirFound
@FOR %%a IN ("%MAVEN_PROJECTBASEDIR%") DO @SET MAVEN_BASEDIR=%%~dpa
:baseDirFound
@IF "%MAVEN_BASEDIR:~-1%"=="\" SET "MAVEN_BASEDIR=%MAVEN_BASEDIR:~0,-1%"

@SET WRAPPER_JAR=%MAVEN_BASEDIR%\.mvn\wrapper\maven-wrapper.jar
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

"%JAVACMD%" -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_BASEDIR%" %WRAPPER_LAUNCHER% %* && EXIT /B 0
@GOTO error

:error
SET ERROR_CODE=1

:end
@ENDLOCAL & SET ERROR_CODE=%ERROR_CODE%
EXIT /B %ERROR_CODE%
