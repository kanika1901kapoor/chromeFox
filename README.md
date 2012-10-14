A chrome plugin to boot into your amazon/cloud machines. This chrome extension mimics the hybridfox plugin for Firefox. It has been developed using YUI , jQuery and the amazonws API.
It can be extended to serve openstack and eucalyptus etc. platforms so that it becomes the one-stop app for booting into cloud machines.
Steps to boot(Start/Terminate) your machine:
	a)Unzip the folder.
	b)Load unpacked extension at chrome://chrome/settings/ and enable it.
	c)Click on the extension icon at top-left side.
	d)Enter your AWS credentials(Access Key and Secret Access Key) and refresh(only required first time).The browser stores the credentials so that you can login next time with more ease.
	e)In the first tab, wait for the images to load (takes a few seconds).
	f)Double-click an image(ami) and fill the options apropriately to start the image
	g)In the second tab, wait for the instances to show up. All kinds of instances will be listed like started,stopped,terminated ones. You can terminate a running instance here.
	h)You may also select any region (like the ec2 region) from the Regions drop down list.This is done if you want any to list images from a particular region or start a machine in a particular region.
The app can be improved in many ways.






