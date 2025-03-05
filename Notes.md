# Mods

1. Update MongoDB `countries` from OneDrive `freebetcodes.countries`

# Others

### Countries 3 Alpha Codes

1. [Populationu](https://www.populationu.com/gen/country-codes-list)
1. [Wikipedia](https://en.wikipedia.org/wiki/Comparison_of_alphabetic_country_codes)

## Toasting code from form values

```
function onSubmit(values: IPlatform) {
  toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
            <code className="text-sky-600">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        ),
      });
   }
```

> Mongo Atlas: tuEmhHkMGhFXFdhw

# Zod and input validation

> Casting a string to a datetime

```
date: z
.string()
.datetime({ message: "Invalid datetime string! Must be UTC." })
.pipe(z.coerce.date()),
```

> Accepting only digits from an input

```
<Input
  pattern="^\d*(\.\d{0,2})?$"
  {...register("value", {
    valueAsNumber: true,
  })}
/>
```

> [Using-zod-to-validate-date-range-picker](https://onur1337.medium.com/using-zod-to-validate-date-range-picker-76145ea28e8a)

> [Exploring-zod-a-comprehensive-guide-to-powerful-data-validation-in-javascript-typescript](https://rasitcolakel.medium.com/exploring-zod-a-comprehensive-guide-to-powerful-data-validation-in-javascript-typescript-2c4818b5646d)

# API Helpers

> Simulate an API fetch delay

```
await new Promise(resolve => setTimeout(resolve, 5000));
```

# Resources

### How to Create a Date and Time Picker Form | Next.js & Shadcn

```
https://www.youtube.com/watch?v=NJRvABjsE6E
https://shadcnui-expansions.typeart.cc/docs/datetime-picker
https://medium.com/@dinh.nt/create-your-own-datetime-picker-using-shadcn-409e6723225f
```

# React Query

```
https://borstch.com/blog/development/creating-custom-react-hooks-with-react-query-library-for-reusable-data-fetching-logic
https://mitchellhein25.github.io/CSharp-and-React-Insights/2023/06/26/React-Query-useMutation-hook.html
https://tkdodo.eu/blog/mastering-mutations-in-react-query
```

# ShadCN Tips

> Use `<Button asChild>` to have your button clickable where the onclick is in the children of the button

> You can use a divider

```
import { Separator } from "@/components/ui/separator";
```

# Database

### Add item to an array of objects in a document

```
People.findOneAndUpdate(
{ name: "Yash Salvi" },
{ $push: { friends: friendNew } },
{ upsert: true }
);

People.findOneAndUpdate(
{ name: "Yash Salvi" },
{ $push: { friends: friendNew } },
).exec();
```

### Delete item from an array of objects in a document

```
function deleteCOI(companyId: string, buildingId: string) {
  const company = await Companies.findOneAndUpdate(
    { companyId },
    { $pull: { cois: { buildingId: buildingId } } }
  );
  return company;
}
```

> [Populate-a-mongoose-model-with-a-field-that-isnt-an-id](https://stackoverflow.com/questions/19287142/populate-a-mongoose-model-with-a-field-that-isnt-an-id)

> [Reference by other field instead of \_id](https://github.com/Automattic/mongoose/issues/8282)

# Typescript & ESLint

```
rules:
"no-explicit-any": ["off"]
NOT "@typescript-eslint/no-explicit-any": ["off"]
```

# React Table

> Creating badges in one column

```
    columnHelper.accessor("roles", {
      cell: (info) => {
        const roles = info.getValue();

        return (
          <div>
            {roles.map((role) => (
              <div className="px-2 py-1 bg-green-500 rounded-full text-white text-center my-2 text-sm">
                {role.toUpperCase()}
              </div>
            ))}
          </div>
        );
      },
      id: "roles",
      header: "Roles",
    })
```

# Timing functions

```
elements.forEach(() => {
console.time('methodCall');
methodCall(() => {
console.time('build');
build();
console.timeEnd('build');
});
console.timeEnd('methodCall');
});
console.timeEnd('everything');
```

# Bets API Collector

> Betway-RSA CURL

```
curl ^"https://www.betway.co.za/BookABet/internal/GetClientSideBetslipForBookingCode?bookingCode=X8EFB5B34^&1739359098055^" ^
  -H ^"accept: */*^" ^
  -H ^"accept-language: en-US,en;q=0.9^" ^
  -b ^"Language=en-ZA; selectedSport~00000000-0000-0000-da7a-000000580001~sport=00000000-0000-0000-da7a-000000550001; MT=20c47b0c-268a-4d4c-9473-c48ef096c0a7; _gcl_au=1.1.385970544.1737369464; _fbp=fb.2.1737369466297.780658435213134067; __cf_bm=CHSneWpPo_gXdynZiLHm36EVGecnOLm_Y3qB0W_IyjE-1739358473-1.0.1.1-655sSXy8uNhFe0.JAMlpE2MtUQODAG7SBBv51d9CZhI1O0oMuk5GjVnOT1N0s67At2jB3K2fblRmjsIT0EEunA; ASP.NET_SessionId=winrhmq2nszjxnhecixgj44n; IsLoggedIn=False; __RequestVerificationToken=m2tueNtbcrwXrA9pl8M2Mzfm2owZMlRzNbCQvNYfvWGs0192D7kzNeedwrYvYAE1I4v8W1-hA3a7PhDAHuwwZkOBMJI1; CacheOffset=0; ST=b3408dde-5c58-4d93-9805-26b0a690bcc2; BTAGCOOKIE=P57471-PR347-CM26005-TS187894; REFERRERBTAGCOOKIE=P57471-PR347-CM26005-TS187894; OriginalQueryString=/; ShowBetslipIcons=; InCashoutPoller=false; _gid=GA1.3.607432679.1739358480; _sp_srt_ses.80c6=*; _clck=1k5hkbe^%^7C2^%^7Cftd^%^7C0^%^7C1846; selectedSport~00000000-0000-0000-da7a-000000580003~sport=00000000-0000-0000-da7a-000000550001; _ga_S7B3NZ61BD=GS1.1.1739358479.4.1.1739358714.58.0.1823975021; _ga=GA1.3.1725321831.1737369466; _sp_srt_id.80c6=d2f40212-1d7e-4067-a4c1-7fdc5d860a80.1737369467.3.1739358715.1737539071.b765ea66-4558-4751-88cb-3d78590de8b1.07bd3c33-e34a-4b6e-ae65-449df52650dd...0; ActivateCashoutPolling=false; FilterCount=0; submenuRef=^#highlights; _uetsid=9efab810e93111efa08147a6b6e2dd6d; _uetvid=966cdb10d71a11ef8f6443440d9149d9; _clsk=1rbfhfv^%^7C1739358721510^%^7C1^%^7C0^%^7Cs.clarity.ms^%^2Fcollect^" ^
  -H ^"priority: u=1, i^" ^
  -H ^"referer: https://www.betway.co.za/^" ^
  -H ^"sec-ch-ua: ^\^"Not(A:Brand^\^";v=^\^"99^\^", ^\^"Google Chrome^\^";v=^\^"133^\^", ^\^"Chromium^\^";v=^\^"133^\^"^" ^
  -H ^"sec-ch-ua-mobile: ?0^" ^
  -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" ^
  -H ^"sec-fetch-dest: empty^" ^
  -H ^"sec-fetch-mode: cors^" ^
  -H ^"sec-fetch-site: same-origin^" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36^"
```

> [Convert curl commands to Python, JavaScript and more](https://curlconverter.com/javascript/)

```
fetch('https://www.betway.co.za/BookABet/internal/GetClientSideBetslipForBookingCode?bookingCode=X8EFB5B34&1739365302099', {
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'priority': 'u=1, i',
    'referer': 'https://www.betway.co.za/',
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'cookie': 'Language=en-ZA; selectedSport~00000000-0000-0000-da7a-000000580001~sport=00000000-0000-0000-da7a-000000550001; MT=20c47b0c-268a-4d4c-9473-c48ef096c0a7; _gcl_au=1.1.385970544.1737369464; _fbp=fb.2.1737369466297.780658435213134067; BTAGCOOKIE=P57471-PR347-CM26005-TS187894; OriginalQueryString=/; _gid=GA1.3.607432679.1739358480; _clck=1k5hkbe%7C2%7Cftd%7C0%7C1846; ASP.NET_SessionId=q0ogevkwqpk20wwlms3nzlkm; IsLoggedIn=False; selectedSport~00000000-0000-0000-da7a-000000580003~sport=00000000-0000-0000-da7a-000000550001; __RequestVerificationToken=E9zNriiuXFL0gLMUxPJqP4i_4_4sl9ignHQi_zczqnu_AiMQxxvrvcaWtjxqx0Ib7OdI4X5_dhmltZFdKJPUiKQfrEE1; CacheOffset=0; __cf_bm=PvyU_8qTW7fRxfl99VKC_QFJJnnbLCMPswMDGtFDuUg-1739365258-1.0.1.1-WEseWIbynUVnAYV5g3865Tk8BoQb2sin9BI6htqJnAtnHr4c6985SNfMN0Fo0Kaq2v5IR_a8uKmoHHCmoW3MRA; ST=1cf2d95d-177d-4be7-b15e-5480ebf2a179; REFERRERBTAGCOOKIE=P57471-PR347-CM26005-TS187894; ShowBetslipIcons=; InCashoutPoller=false; ActivateCashoutPolling=false; FilterCount=0; submenuRef=#highlights; _gat_UA-1515961-21=1; _ga=GA1.1.1725321831.1737369466; _ga_S7B3NZ61BD=GS1.1.1739365263.6.0.1739365263.60.0.736685197; _uetsid=9efab810e93111efa08147a6b6e2dd6d; _uetvid=966cdb10d71a11ef8f6443440d9149d9; _sp_srt_ses.80c6=*; _sp_srt_id.80c6=d2f40212-1d7e-4067-a4c1-7fdc5d860a80.1737369467.4.1739365265.1739358715.c17eccbe-db76-4f2e-b7b9-3256625e36a6.b765ea66-4558-4751-88cb-3d78590de8b1...0; _clsk=1h8zltj%7C1739365266117%7C1%7C0%7Cs.clarity.ms%2Fcollect'
  }
});
```

# API Football

> [Tutorials](https://www.api-football.com/news/category/tutorials)

# Modified shadcn `Button.tsx` with loaders

```
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover",
        outline:
          "border border-input bg-muted shadow-sm hover:bg-muted-block hover:text-primary hover:border-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        table: "h-9 py-2 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

```
