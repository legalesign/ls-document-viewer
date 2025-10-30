import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-page-loader',
  styleUrl: 'ls-page-loader.css',
  shadow: true,
})
export class LsPageLoader {
  render() {
    return (
      <Host>
        <div class={'loading-animation'}>
          <svg class="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g id="Icon/solid/logo">
              <g id="Icon">
                <path
                  class="classic-sequential-front"
                  d="M9.11077 0.940012C8.98702 0.868406 8.83446 0.868297 8.71061 0.939725C8.58675 1.01115 8.51044 1.14326 8.51044 1.28623V2.34625C8.51044 2.48927 8.5868 2.62141 8.71071 2.69282L14.6321 6.10546C14.818 6.21257 14.9325 6.41078 14.9325 6.6253V13.4621C14.9325 13.6044 15.0081 13.7359 15.131 13.8076L16.0285 14.3311C16.1522 14.4033 16.305 14.4038 16.4292 14.3325C16.5534 14.2611 16.63 14.1288 16.63 13.9856V5.52152C16.63 5.37876 16.5539 5.24681 16.4303 5.17531L9.11077 0.940012Z"
                  fill="currentColor"
                />
                <path
                  class="classic-sequential-middle"
                  d="M6.35621 2.52413C6.23246 2.45251 6.07989 2.45239 5.95603 2.52381C5.83217 2.59524 5.75585 2.72735 5.75585 2.87033V3.94156C5.75585 4.08504 5.83269 4.21752 5.95722 4.28876L8.20838 5.57659C8.39518 5.68345 8.51044 5.88218 8.51044 6.09739V9.75268C8.51044 9.89534 8.58642 10.0272 8.70984 10.0987L11.8717 11.9316C12.0569 12.0389 12.1708 12.2367 12.1708 12.4507V16.1015C12.1708 16.2434 12.2461 16.3747 12.3685 16.4465L13.2784 16.9801C13.4021 17.0526 13.5552 17.0534 13.6796 16.9821C13.804 16.9108 13.8808 16.7784 13.8808 16.635V7.10976C13.8808 6.96701 13.8047 6.83507 13.6811 6.76356L6.35621 2.52413Z"
                  fill="currentColor"
                />
                <path
                  class="classic-sequential-back"
                  d="M3.60419 4.12505C3.48039 4.05421 3.32824 4.05465 3.20486 4.1262C3.08147 4.19776 3.00552 4.3296 3.00552 4.47223V15.0385C3.00552 15.1812 3.08151 15.3131 3.20494 15.3846L10.5339 19.6323C10.6576 19.704 10.8102 19.7042 10.9341 19.6328C11.0581 19.5614 11.1344 19.4293 11.1344 19.2862V12.9374C11.1344 12.795 11.0587 12.6634 10.9357 12.5917L7.78047 10.7551C7.59587 10.6476 7.48232 10.4501 7.48232 10.2365V6.57621C7.48232 6.43276 7.40549 6.30029 7.28098 6.22904L3.60419 4.12505Z"
                  fill="currentColor"
                />
              </g>
            </g>
          </svg>

          <style>
            {`
          @keyframes classic-sequential-back {
            0% { opacity: 0; transform: scale(0.3); }
            2% { opacity: 0.3; transform: scale(0.5); }
            4% { opacity: 0.6; transform: scale(0.7); }
            6% { opacity: 0.8; transform: scale(0.85); }
            8% { opacity: 1; transform: scale(1); }
            22% { opacity: 1; transform: scale(1); }
            55% { opacity: 1; transform: scale(1); }
            64% { opacity: 1; transform: scale(1); }
            65% { opacity: 0.9; transform: scale(0.95); }
            66.2% { opacity: 0.75; transform: scale(0.88); }
            67.2% { opacity: 0.6; transform: scale(0.8); }
            68% { opacity: 0.4; transform: scale(0.7); }
            68.8% { opacity: 0.25; transform: scale(0.6); }
            69.5% { opacity: 0.1; transform: scale(0.45); }
            70% { opacity: 0.05; transform: scale(0.35); }
            71% { opacity: 0; transform: scale(0.3); }
            100% { opacity: 0; transform: scale(0.3); }
          }

          @keyframes classic-sequential-middle {
            0%, 16% { opacity: 0; transform: scale(0.3); }
            18% { opacity: 0.3; transform: scale(0.5); }
            20% { opacity: 0.6; transform: scale(0.7); }
            22% { opacity: 0.8; transform: scale(0.85); }
            24% { opacity: 1; transform: scale(1); }
            36%, 65%, 70% { opacity: 1; transform: scale(1); }
            71% { opacity: 0.9; transform: scale(0.95); }
            72.2% { opacity: 0.75; transform: scale(0.88); }
            73.2% { opacity: 0.6; transform: scale(0.8); }
            74% { opacity: 0.4; transform: scale(0.7); }
            74.8% { opacity: 0.25; transform: scale(0.6); }
            75.5% { opacity: 0.1; transform: scale(0.45); }
            76% { opacity: 0.05; transform: scale(0.35); }
            77%, 100% { opacity: 0; transform: scale(0.3); }
          }

          @keyframes classic-sequential-front {
            0%, 32% { opacity: 0; transform: scale(0.3); }
            34% { opacity: 0.3; transform: scale(0.5); }
            36% { opacity: 0.6; transform: scale(0.7); }
            38% { opacity: 0.8; transform: scale(0.85); }
            40% { opacity: 1; transform: scale(1); }
            60%, 76% { opacity: 1; transform: scale(1); }
            77% { opacity: 0.9; transform: scale(0.95); }
            78.2% { opacity: 0.75; transform: scale(0.88); }
            79.2% { opacity: 0.6; transform: scale(0.8); }
            80% { opacity: 0.4; transform: scale(0.7); }
            80.8% { opacity: 0.25; transform: scale(0.6); }
            81.5% { opacity: 0.1; transform: scale(0.45); }
            82% { opacity: 0.05; transform: scale(0.35); }
            83%, 100% { opacity: 0; transform: scale(0.3); }
          }

          .classic-sequential-back {
            animation: classic-sequential-back 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
            transform-origin: center;
          }

          .classic-sequential-middle {
            animation: classic-sequential-middle 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
            transform-origin: center;
          }

          .classic-sequential-front {
            animation: classic-sequential-front 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
            transform-origin: center;
          }
        `}
          </style>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
