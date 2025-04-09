
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Key, UploadCloud, Wallet, ExternalLink, Info } from 'lucide-react';
import { WalletInfo, connectWallet, disconnectWallet, isWalletInstalled } from '@/utils/walletUtils';
import { useToast } from '@/hooks/use-toast';
import { useActivityTracker } from '@/utils/activityTracker';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';

interface WalletConnectProps {
  walletInfo: WalletInfo;
  onWalletConnect: (info: WalletInfo) => void;
  onWalletDisconnect: () => void;
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  walletInfo, 
  onWalletConnect, 
  onWalletDisconnect, 
  className 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { trackActivity } = useActivityTracker();
  const walletDetected = isWalletInstalled();

  const handleConnectWallet = async () => {
    if (!walletDetected) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet to connect.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      const info = await connectWallet();
      onWalletConnect(info);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${info.address.substring(0, 6)}...${info.address.substring(info.address.length - 4)}`,
        variant: "default"
      });
      
      // Track activity
      trackActivity('connect_wallet', '/blockchain', {
        address: info.address,
        network: info.network,
        chainId: info.chainId
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    // Track before disconnecting
    if (walletInfo.isConnected) {
      trackActivity('disconnect_wallet', '/blockchain', {
        address: walletInfo.address,
        network: walletInfo.network
      });
    }
    
    onWalletDisconnect();
    toast({
      title: "Wallet Disconnected",
      description: "You have disconnected your wallet",
      variant: "default"
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const viewOnEtherscan = () => {
    const baseUrl = walletInfo.chainId === 5 
      ? "https://goerli.etherscan.io/address/" 
      : walletInfo.chainId === 137 
      ? "https://polygonscan.com/address/" 
      : "https://etherscan.io/address/";
    
    window.open(`${baseUrl}${walletInfo.address}`, '_blank');
  };

  const renderWalletButton = () => {
    if (!walletDetected) {
      return (
        <div className="flex flex-col items-start gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => window.open('https://metamask.io/download/', '_blank')} 
                className="w-full sm:w-auto gap-1"
              >
                Install MetaMask <Wallet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Click to visit MetaMask website to install the wallet</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Info className="h-3 w-3" />
            <span>A wallet is required to use blockchain features</span>
          </div>
        </div>
      );
    }
    
    return (
      <Button 
        onClick={handleConnectWallet} 
        className="w-full sm:w-auto gap-1"
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
        <Wallet className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Wallet Connection</CardTitle>
          <CardDescription>Connect your wallet to manage health records</CardDescription>
        </div>
        <Wallet className="h-5 w-5 text-health-purple" />
      </CardHeader>
      <CardContent>
        {walletInfo.isConnected ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Wallet Connected</p>
                <p className="text-sm font-mono text-muted-foreground">
                  {shortenAddress(walletInfo.address)}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                <Check className="h-3 w-3 mr-1" /> Connected
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-medium">{walletInfo.network}</span>
                
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-medium">{parseFloat(walletInfo.balance).toFixed(4)} ETH</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={viewOnEtherscan}
              >
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
              >
                <UploadCloud className="h-4 w-4" />
                Backup Data
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm">Connect your Ethereum wallet to securely manage your health records on the blockchain.</p>
            {renderWalletButton()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
