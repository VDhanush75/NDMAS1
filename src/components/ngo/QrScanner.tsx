import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { User } from '../../types';
import { CheckCircle, XCircle, User as UserIcon, AlertTriangle, CameraOff, RefreshCw } from 'lucide-react';

interface QrScannerProps {
  citizens: User[];
  onScanSuccess: (citizen: User) => void;
  onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ citizens, onScanSuccess, onClose }) => {
  const [scannedCitizen, setScannedCitizen] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<'success' | 'already_received' | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const readerId = "qr-reader-container";

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    let hasStopped = false;

    // Delay scanner initialization to ensure the DOM element is ready,
    // especially when rendered inside an animating modal.
    const timeoutId = setTimeout(() => {
      try {
        scanner = new Html5Qrcode(readerId);

        const successCallback = (decodedText: string) => {
          if (hasStopped) return;
          hasStopped = true;

          scanner?.stop()
            .then(() => {
              try {
                const data = JSON.parse(decodedText);
                const citizen = citizens.find(c => c.id === data.id);
                if (citizen) {
                  setScannedCitizen(citizen);
                  if (citizen.aidStatus === 'Received') {
                    setScanResult('already_received');
                  }
                } else {
                  setError('Citizen not found in the database.');
                }
              } catch (e) {
                setError('Invalid QR code format.');
              }
            })
            .catch(err => {
              console.error("Error stopping the scanner after success: ", err);
            });
        };

        const errorCallback = (err: any) => {
          if (hasStopped) return;
          if (err.name === 'NotAllowedError') {
            setError("Camera permission denied. Please enable it in your browser settings and click Retry.");
          } else {
            // Do not set error for minor scan issues to avoid user confusion
          }
        };

        setError(null);
        setScannedCitizen(null);
        setScanResult(null);

        scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          successCallback,
          () => { /* ignore partial scan errors */ }
        ).catch(errorCallback);

      } catch (e) {
        console.error("Failed to initialize QR Scanner:", e);
        setError("Could not initialize the QR scanner component. The container element might be missing.");
      }
    }, 200); // 200ms delay

    return () => {
      clearTimeout(timeoutId);
      if (!hasStopped && scanner && scanner.isScanning) {
        hasStopped = true;
        scanner.stop().catch(err => {
          console.warn("Error stopping scanner on cleanup: ", err.name);
        });
      }
    };
  }, [isRetrying, citizens]);

  const handleRetry = () => {
    setIsRetrying(prev => !prev);
  };

  const handleConfirmAid = () => {
    if (scannedCitizen && scannedCitizen.aidStatus !== 'Received') {
      onScanSuccess(scannedCitizen);
      setScanResult('success');
    }
  };

  if (scanResult === 'success') {
    return (
        <div className="text-center p-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Aid Distributed Successfully!</h3>
            <p className="text-gray-600 mt-2">Aid for {scannedCitizen?.name} has been recorded.</p>
            <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Close</button>
        </div>
    );
  }

  if (scanResult === 'already_received') {
    return (
        <div className="text-center p-8">
            <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Aid Already Received</h3>
            <p className="text-gray-600 mt-2">{scannedCitizen?.name} has already received their aid package.</p>
            <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Close</button>
        </div>
    );
  }

  if (scannedCitizen) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold text-center mb-4">Citizen Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
                <UserIcon className="w-10 h-10 text-gray-500" />
                <div>
                    <p className="font-bold text-gray-800">{scannedCitizen.name}</p>
                    <p className="text-sm text-gray-600">{scannedCitizen.mobile}</p>
                    <p className="text-sm text-gray-600">{`${scannedCitizen.area}, ${scannedCitizen.district}`}</p>
                </div>
            </div>
        </div>
        <button onClick={handleConfirmAid} className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
            <CheckCircle className="w-5 h-5 mr-2" /> Confirm Aid Distribution
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <CameraOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Camera Error</h3>
        <p className="text-gray-600 mt-2 mb-6">{error}</p>
        <button
          onClick={handleRetry}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div id={readerId} className="w-full rounded-lg overflow-hidden border min-h-[300px]"></div>
    </div>
  );
};

export default QrScanner;
