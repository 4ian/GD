Official extensions for GDevelop
====================================

These are the official extensions directly bundled with GDevelop.


Getting started
---------------

First, take a look at the *Readme.md* at the root of the repository and the [developer documentation](http://4ian.github.io/GD-Documentation/).
Extensions always contains an Extension.cpp and/or a JsExtension.cpp file that are used
to expose the extension to GDevelop IDE.

After being compiled, extensions binaries are put in Binaries/Output/Release_*{OS}*/CppPlatform/Extensions
(or Binaries/Output/Release_*{OS}*/JsPlatform/Extensions), where *{OS}* can be Windows, Linux
for example.

Contributing
------------

Any contribution is welcome! Whether you want to submit a bug report, a feature request
or any pull request so as to add a nice feature, do not hesitate to get in touch.

License
-------

  * Extensions are provided under the MIT License: see license.txt file.
  * External libraries can be used by extensions (Box2D, Dlib or SPARK for example). See their
licenses in their directories.
