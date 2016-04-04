#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class ImageFallApp : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void update() override;
	void draw() override;
};

void ImageFallApp::setup()
{
}

void ImageFallApp::mouseDown( MouseEvent event )
{
}

void ImageFallApp::update()
{
}

void ImageFallApp::draw()
{
	gl::clear( Color( 0, 0, 0 ) ); 
}

CINDER_APP( ImageFallApp, RendererGl )
