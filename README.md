# social-graph
A graph prototyping tool for mapping relationships.


### About
Initially intended for playing around with visualizing social networks, the tool can be used to view csv data to see relationships between entries. 
The input is currently restricted to published google sheets csv files. I haven't spent the time to support other csv sources, google authentication, or non-csv formats.

### Example
Here's [an example](https://jreamy.github.io/social-graph/?id=2PACX-1vQEjcHllKZ6WFjH8VTk2xmyRmoS6pg2dIW4qGEvdOoQX3w2W4CLofJ0b8B2rClE5mmozBxhx9opiBBe&gid=0&nodes=W3siZmllbGRzIjpbeyJ2YWx1ZSI6Ik5hbWUiLCJtZXJnZSI6dHJ1ZX1dLCJ2aXNpYmxlIjp0cnVlfSx7ImZpZWxkcyI6W3sidmFsdWUiOiJQcm9ncmFtIiwibWVyZ2UiOmZhbHNlfSx7InZhbHVlIjoiQ29sbGFib3JhdGlvbiIsIm1lcmdlIjpmYWxzZX1dLCJ2aXNpYmxlIjp0cnVlfV0%3D&links=W1swLDFdXQ%3D%3D&fbclid=IwAR0Ys3gN02JukeQrJY7A_rSoAVSHGAtT8bGz5R1fkJgzt50jNg2Jum92KMc) with [some fake data](https://docs.google.com/spreadsheets/d/e/2PACX-1vQEjcHllKZ6WFjH8VTk2xmyRmoS6pg2dIW4qGEvdOoQX3w2W4CLofJ0b8B2rClE5mmozBxhx9opiBBe/pubhtml?gid=0&single=true) that shows an example of what the tool can do. 

### Settings

In the top left there's a menu button to access the settings.

**Sheet:** The input google sheet to use.

**Node:** The 'nouns' of the graph; the people or things that may have relationships. They can be simple information like names (examples: "Alice", "Bob") or a combination of information (examples: "Conference X in 2020", "Conference X in 2021", "Conference Y in 2020"). 

**Edges:** These are simple toggles for now, showing or hiding the relationship between a set of nodes. They are the arrows `<->` between numbers shown below the nodes.

**Save:** This saves the settings in the link so you can copy and paste the link for easy use.

### Setup

1. Create a google sheet with csv publishing. This is a prototype, so I haven't and probably won't build an integration with google authentication mechanisms to allow using private google sheets.
    
    - Create and open a google sheet
    - Click File -> Share -> Publish to the Web
    - Set "Entire Document" to the sheet you want to publish
    - Set "Web Page" to "Comma-Separated Values (.csv)"
    - Check "Automatically republish when changes are made"
    - **Copy the link**

2. Enter the first row of data. This will show up in the tool as the options for the node inputs.

3. Enter other rows of data. These will show up as relationships in the graph.

4. Open the [empty](https://jreamy.github.io/social-graph/) prototype page and click on the settings.

5. Paste the link from the sheet.

6. Click `Add Node`, click on the node, and select the column name to use. You should see the data from the sheet appear in the space to the right, but with no connections yet.

7. Click `Add Node` again and select another column to use.

8. Check `0 <-> 1` box to show the links. Any nodes that show up on the same row will now have a connection between them.

Continue adding nodes and enabling / disabling edges as you like.

Tips:
 - click and drag nodes to move them around
 - click the `+` button on a node to add another piece of information to it (i.e. Conference X in 2020 instead of just Conference X)
 - click the `-` button on a node to remove the last piece of information on it.
 - the `merge` option allows using the merge cell option in google sheets. It reuses values when cells are empty, which is how merged cells show up in the csv format.
 - the `hide` option allows temporarily removing a node from the display without deleting its settings. It can be show again by pressing `show`.
