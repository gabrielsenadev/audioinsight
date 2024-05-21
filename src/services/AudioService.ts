class AudioService {
  private static instance: AudioService;

  private constructor() {
  }

  public static getInstance() {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }

    return AudioService.instance;
  }
}

export default AudioService;
