
interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const shareToSocialMedia = async (platform: 'facebook' | 'twitter' | 'linkedin', data: ShareData) => {
  const urlParams = new URLSearchParams();
  
  switch (platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`, '_blank');
      break;
    case 'twitter':
      urlParams.append('text', `${data.title}\n${data.text}`);
      urlParams.append('url', data.url);
      window.open(`https://twitter.com/intent/tweet?${urlParams.toString()}`, '_blank');
      break;
    case 'linkedin':
      urlParams.append('url', data.url);
      urlParams.append('title', data.title);
      urlParams.append('summary', data.text);
      window.open(`https://www.linkedin.com/shareArticle?mini=true&${urlParams.toString()}`, '_blank');
      break;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
