/**
 * Function for setting a decaying interval of delays for an array of HTML elements.
 * Aiming to give it a gentle tappering effect for fade-in transitions.
 * 
 * @param i - the index of the item from an array of items
 * @param s - the initial delay interval/step between items **in Seconds.**
 * @param m - max delay, in seconds. Defaults to 3
 * @param d - how quickly / how many steps until it platuaes. Defaults to 10
 * @returns string - a number, **in Seconds**
 */
export default function animationEase(i: number, s: number = 0.4, m: number = 3, d: number = 10): string {

    let stackSpread = (n: number, step:number = 0): number => {
        if (n <= 0) return step;
        if (step > m) return m;

        step += (d-n < 0) ? s*0.1 : ((d-n+1) / d) * s;
        return stackSpread(n-1, step);
    }
    let delay = stackSpread(i).toFixed(2);

    // console.log(`| ${String(i).padStart(2, '0')} | DELAY: ${delay}  |`);

    return delay;
}

// let x = 0;
// let y = 20;
// while (x <= y){
//     aniDelay(x, 0.2, 3, 24);
//     x++;
// }
