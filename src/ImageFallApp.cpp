#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

#include <iomanip>

using namespace ci;
using namespace ci::app;
using namespace std;

class ImageFallApp : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void mouseDrag( MouseEvent event ) override;
	void keyDown(KeyEvent event) override;
	
	void update() override;
	void draw() override;
	
	gl::TextureRef mTexture;
	Surface mSurface;
	Channel mChannel;
	
	gl::GlslProgRef mShader;
	gl::FboRef mFbo;
	vector<gl::FboRef> mFbos;
	size_t mFboCounter;
	
	float mExposure, mOffset;
	int mMode;
};

Channel edgeDetectArea( Channel *surface, float q=1)
{
	// make a copy of the original before we start writing on it
	Channel inputSurface( surface->clone() );
	Channel outputSurface( surface->clone() );
	
	// we'll need to iterate the inputSurface as well as the output surface
	Channel::ConstIter inputIter( inputSurface, surface->getBounds() );
	Channel::Iter outputIter( outputSurface.getIter() );
	
	while( inputIter.line() ) {
		outputIter.line();
		while( inputIter.pixel() ) {
			outputIter.pixel();
			
			auto v = inputIter.v();
			
			float output = 0;
			vector<int> indices = { -1, 1 };
			for (auto xi : indices) {
				for (auto yi : indices) {
					auto op = inputIter.vClamped(xi, yi);
//					if (op < v)  {
						output+= op;
//					}
				}
			}
			
			output *= 0.25;
			outputIter.v() = constrain<uint8_t>(output, 0, 255);
			
			
			
//			if (north < v) output+= north - v;
//			
//			
//			int32_t sumRed = inputIter.vClamped( 0, -1 ) + inputIter.vClamped( -1, 0 ) + inputIter.v() * -4 + inputIter.vClamped( 1, 0 ) + inputIter.vClamped( 0, 1 );
//			outputIter.v() = constrain<uint8_t>( abs( sumRed ), 0, 255 );
//			int32_t sumGreen = inputIter.gClamped( 0, -1 ) + inputIter.gClamped( -1, 0 ) + inputIter.g() * -4 + inputIter.gClamped( 1, 0 ) + inputIter.gClamped( 0, 1 );
//			outputIter.g() = constrain<int32_t>( abs( sumGreen ), 0, 255 );
//			int32_t sumBlue = inputIter.bClamped( 0, -1 ) + inputIter.bClamped( -1, 0 ) + inputIter.b() * -4 + inputIter.bClamped( 1, 0 ) + inputIter.bClamped( 0, 1 );
//			outputIter.b() = constrain<int32_t>( abs( sumBlue ), 0, 255 );
		}
	}
	
	return outputSurface;
}

void ImageFallApp::setup() {

	mSurface = Surface(loadImage(loadAsset("input_3.jpg")));
//	mSurface = Surface(loadImage(loadAsset("maia.jpg")));
	mChannel = Channel(mSurface);
	
	auto channel = edgeDetectArea(&mChannel);
	
	mTexture = gl::Texture::create(mChannel);
	setWindowSize(mSurface.getSize());
	
	
	mShader = gl::GlslProg::create(gl::GlslProg::Format().vertex(loadAsset("shader.vert")).fragment(loadAsset("shader.frag")));
	
	gl::Fbo::Format format;
//	format.setSamples( 4 ); // uncomment this to enable 4x antialiasing
	mFbo = gl::Fbo::create(mTexture->getWidth(), mTexture->getHeight());

	mExposure = 1;
	mOffset = 1;
	
	mFbos.resize(2);
	for (size_t i = 0; i < mFbos.size(); i++) {
		mFbos[i] = gl::Fbo::create(mTexture->getWidth(), mTexture->getHeight());
		
		mFbos[i]->getColorTexture()->setMagFilter(GL_NEAREST);
		mFbos[i]->getColorTexture()->setMinFilter(GL_NEAREST);
//		mTexture->setMinFilter(GL_NEAREST);
//		mTexture->setMagFilter(GL_NEAREST);
		
//		mFbos[i]->bindFramebuffer();
//		gl::clear( Color( 0, 0, 0 ) );
//		gl::ScopedGlslProg shader(mShader);
//		gl::ScopedTextureBind tex(mTexture);
//		mShader->uniform("uOffset", 1);
//		gl::draw(mTexture);
//		gl::drawSolidRect(mTexture->getBounds());
//		mFbos[i]->unbindFramebuffer();
	}
	mFboCounter = 0;
	mMode = 0;
	
	mTexture->setMinFilter(GL_NEAREST);
	mTexture->setMagFilter(GL_NEAREST);
	
	
}

void ImageFallApp::mouseDrag( MouseEvent event )
{
//	mExposure = powf( event.getPos().x / (float)getWindowWidth() * 2, 4 );
//	console() << "Exposure: " << mExposure << std::endl;
	
	mOffset = lmap<float>(event.getPos().x, 0, getWindowWidth(), 0, 20);
	
//	console() << "Offset: " << mOffset << std::endl;
}

void ImageFallApp::mouseDown( MouseEvent event )
{
}

void ImageFallApp::keyDown(KeyEvent event) {
	if (event.getChar() == 'r') {
		for (size_t i = 0; i < mFbos.size(); i++) {
			
			mFbos[i]->bindFramebuffer();
			gl::draw(mTexture);
			mFbos[i]->unbindFramebuffer();
		}
		
		cout << endl;
		cout << endl;
		cout << endl;
	}
	
	auto key = event.getChar();
	if (key >= '0' && key <= '9') {
		mMode = static_cast<int>(key - '0');
	}
}

void ImageFallApp::update()
{
//	//mChannel = Channel(mSurface);
//	
//	float q = lmap<float>(getMousePos().x, 0, getWindowSize().x, 0, 1);
//	auto channel = edgeDetectArea(&mChannel, q);
//	mChannel = channel;
//	mTexture = gl::Texture::create(channel);
//	setWindowSize(mSurface.getSize());

//	gl::ScopedFramebuffer fb(mFbo);
	
	

}

void ImageFallApp::draw()
{
	gl::FboRef fbo1 = mFbos[mFboCounter % mFbos.size()];
	gl::FboRef fbo2 = mFbos[(mFboCounter+1) % mFbos.size()];
	
	if (mFboCounter == 0) {
		for (size_t i = 0; i < mFbos.size(); i++) {
			
			mFbos[i]->bindFramebuffer();
			gl::draw(mTexture);
			mFbos[i]->unbindFramebuffer();
		}

	}
	else {
		fbo1->bindFramebuffer();

		gl::clear( Color( 0, 0, 0 ) );
		gl::ScopedGlslProg shader(mShader);
		gl::ScopedTextureBind tex(fbo2->getColorTexture());
		mShader->uniform( "uMode", mMode);
		mShader->uniform("uOffset", mOffset); //mOffset / float(mTexture->getWidth()/20.0f));
		mShader->uniform("uSize", vec2(mTexture->getSize()));
		gl::drawSolidRect(mTexture->getBounds());


//		gl::draw(fbo2->getColorTexture());
		fbo1->unbindFramebuffer();

	}
//	mFboCounter = 0;
	
	mFboCounter++;
//

	
	
//	gl::Texture::create
//	mTexture = gl::Texture(mFbo->getColorTexture());
//	mTexture->replace(mFbo->getColorTexture());
//	mTexture->update(<#const cinder::gl::TextureData &textureData#>)
	//mTexture = mFbo->getColorTexture();
	
	gl::draw(fbo1->getColorTexture());
//
//	auto surf = fbo1->readPixels8u(Area(425, 445, 430, 446));
//	auto surf = fbo1->readPixels8u(Area(327, 344, 340, 349));

	auto surf = fbo1->readPixels8u(fbo1->getBounds());

//	stringstream ss;
//	ss << "/Users/whg/Desktop/imgs/";
//	ss << mFboCounter;
//	writeImage(ss.str(), surf, ImageTarget::Options(), "jpg");

//	
//	auto it = surf.getIter();
//	while (it.line()) {
//		while (it.pixel()) {
////			cout << it.v()
//			cout << setw(5) << static_cast<int>(it.r());
//		}
//		cout << endl;
//	}
//	
//	cout << "---" << mOffset << endl;
//	gl::draw(mTexture);

	
}

CINDER_APP( ImageFallApp, RendererGl )
