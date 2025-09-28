
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode, Camera, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QrScannerProps {
  onScan: (civilId: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();

  const startScanner = async () => {
    try {
      setCameraError(null);
      setScanning(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // In a real app, we would use a QR scanning library here
      // For now, simulate a successful scan after 3 seconds
      setTimeout(() => {
        if (scanning) {
          stopScanner();
          // Simulate QR code detection with a mock civil ID
          handleScanSuccess("1234567890");
        }
      }, 3000);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setScanning(false);
      setHasCamera(false);
      setCameraError("Unable to access camera. Please ensure camera permissions are granted.");
    }
  };

  const stopScanner = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScanSuccess = (civilId: string) => {
    toast({
      title: "QR Code Scanned",
      description: `Civil ID: ${civilId}`,
    });
    onScan(civilId);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cameraError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}
        
        <div className="relative aspect-square w-full max-w-xs mx-auto bg-muted mb-4 overflow-hidden rounded-lg">
          {scanning ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary animate-pulse-scan" />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-center text-sm text-muted-foreground">
                Camera preview will appear here
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!scanning ? (
            <Button
              className="w-full"
              onClick={startScanner}
              disabled={!hasCamera}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="secondary"
              onClick={stopScanner}
            >
              <Camera className="mr-2 h-4 w-4" />
              Stop Scanning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QrScanner;
