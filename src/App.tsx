import { useState } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Download, Palette, Settings, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const blink = createClient({
  projectId: 'pretzel-screw-art-generator-c8zah857',
  authRequired: false
})

const backgroundColors = [
  { name: 'Warm White', value: '#F8F9FA', hex: '#F8F9FA' },
  { name: 'Ocean Blue', value: '#0EA5E9', hex: '#0EA5E9' },
  { name: 'Sunset Orange', value: '#F97316', hex: '#F97316' },
  { name: 'Forest Green', value: '#10B981', hex: '#10B981' },
  { name: 'Royal Purple', value: '#8B5CF6', hex: '#8B5CF6' },
  { name: 'Rose Pink', value: '#EC4899', hex: '#EC4899' },
  { name: 'Charcoal Gray', value: '#374151', hex: '#374151' },
  { name: 'Golden Yellow', value: '#F59E0B', hex: '#F59E0B' },
]

const screwTypes = [
  'hex bolts', 'wood screws', 'machine screws', 'sheet metal screws', 
  'carriage bolts', 'socket head screws', 'thumb screws', 'wing screws'
]

const pretzelStyles = [
  'classic twisted pretzel', 'mini pretzel bites', 'pretzel stick', 
  'braided pretzel', 'pretzel roll', 'giant soft pretzel'
]

function App() {
  const [selectedColor, setSelectedColor] = useState(backgroundColors[0])
  const [selectedScrewType, setSelectedScrewType] = useState(screwTypes[0])
  const [selectedPretzelStyle, setSelectedPretzelStyle] = useState(pretzelStyles[0])
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'auto'>('high')

  const generateImage = async () => {
    setIsGenerating(true)
    toast.loading('Generating your pretzel art...', { id: 'generating' })
    
    try {
      const prompt = `A beautiful artistic ${selectedPretzelStyle} made entirely from ${selectedScrewType}, arranged in perfect pretzel shape. The screws should be metallic and realistic, forming the twisted pretzel pattern. High quality, professional photography style, studio lighting, clean composition, on a solid ${selectedColor.name.toLowerCase()} background color ${selectedColor.hex}. The screws should be the main focus, clearly visible and well-defined, creating an artistic sculpture.`
      
      const attemptGenerate = async (imgQuality: 'low' | 'medium' | 'high' | 'auto') => {
        const { data } = await blink.ai.generateImage({
          prompt,
          size: '1024x1024',
          quality: imgQuality,
          n: 1
        })
        return data && data[0]?.url ? data[0].url : null
      }
      
      let url: string | null = null
      try {
        url = await attemptGenerate(quality)
      } catch (err) {
        console.warn('Primary quality failed, attempting fallback...', err)
      }

      if (!url && quality === 'high') {
        url = await attemptGenerate('medium')
      }

      if (url) {
        setGeneratedImage(url)
        toast.success('Pretzel art generated successfully!', { id: 'generating' })
      } else {
        throw new Error('No image URL returned')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.', { id: 'generating' })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `pretzel-screw-art-${selectedColor.name.toLowerCase().replace(' ', '-')}.png`
      link.click()
      toast.success('Image downloaded!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Pretzel <span className="text-orange-600">Screw</span> Art
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate unique artistic images of pretzels made from screws on beautiful solid backgrounds
          </p>
          <Badge variant="secondary" className="mt-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Art Generator
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Customization Panel
                </CardTitle>
                <CardDescription>
                  Choose your preferred settings to create unique pretzel art
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Background Color Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Background Color
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {backgroundColors.map((color) => (
                      <Button
                        key={color.name}
                        variant={selectedColor.name === color.name ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                        className="h-auto p-3 justify-start"
                      >
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Screw Type Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Screw Type</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {screwTypes.map((screw) => (
                      <Button
                        key={screw}
                        variant={selectedScrewType === screw ? "default" : "outline"}
                        onClick={() => setSelectedScrewType(screw)}
                        className="justify-start"
                      >
                        {screw}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Pretzel Style Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pretzel Style</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {pretzelStyles.map((style) => (
                      <Button
                        key={style}
                        variant={selectedPretzelStyle === style ? "default" : "outline"}
                        onClick={() => setSelectedPretzelStyle(style)}
                        className="justify-start capitalize"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Quality Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Image Quality</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={quality === 'medium' ? "default" : "outline"}
                      onClick={() => setQuality('medium')}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={quality === 'high' ? "default" : "outline"}
                      onClick={() => setQuality('high')}
                    >
                      High
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Generate Button */}
                <Button 
                  onClick={generateImage}
                  disabled={isGenerating}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Art...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Pretzel Art
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Image Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Generated Artwork</CardTitle>
                <CardDescription>
                  Your AI-generated pretzel made from screws
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {generatedImage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                        <img 
                          src={generatedImage} 
                          alt="Generated pretzel art" 
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={downloadImage}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          onClick={generateImage}
                          disabled={isGenerating}
                          className="flex-1"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate New
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg text-gray-600 mb-2">No artwork generated yet</p>
                        <p className="text-sm text-gray-500">
                          Customize your settings and click "Generate Pretzel Art" to create your unique artwork
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Made with ❤️ using AI • Create unique pretzel art from screws
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App