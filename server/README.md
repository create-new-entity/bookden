

### Image upload/download prototype

<ol>
    <li>
        temporarily change dev script like this: "dev": "cross-env NODE_ENV=test tsx watch index.ts",
    </li>
    <li>
        Upload image like this: curl -X POST -F "my_test_image=@/Users/mdimranpavel/Desktop/Grumpy Cat.jpg" http://localhost:3000/api/images/upload
    </li>
    <li>
        Then to test, go to browser like this: http://localhost:3000/api/images/1
    </li>
</ol>





