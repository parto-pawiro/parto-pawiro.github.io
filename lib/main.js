// Execute the following code when the window has finished loading
window.onload = function () {

  // Define variables to hold family data and total member count
  var familyData;
  var totalMembers;

  FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.john);

  FamilyTree.templates.myTemplate_male = Object.assign({}, FamilyTree.templates.myTemplate);
  FamilyTree.templates.myTemplate_male.node = '<circle cx="60" cy="60" r="60" fill-opacity="0.0" stroke="#2196F3 " stroke-width="4"></circle>';
  FamilyTree.templates.myTemplate_male.died = '<foreignobject class="node" x="80" y="-5" width="30" height="30"><img src="assets/allahummaghfirlahu.png" width="30" height="30"></foreignobject>';
  FamilyTree.templates.myTemplate_male.field_0 = '<rect x="0" y="130" height="25" width="120" stroke-width="2" fill="#2196F3" stroke="#ffffff" rx="7" ry="7"></rect><text width="230" style="font-size: 16px;font-weight:bold;" fill="#000000" x="60" y="148" text-anchor="middle">{val}</text>';


  FamilyTree.templates.myTemplate_female = Object.assign({}, FamilyTree.templates.myTemplate);
  FamilyTree.templates.myTemplate_female.node = '<circle cx="60" cy="60" r="60" fill-opacity="0.0" stroke="#FFC0CB" stroke-width="4"></circle>';
  FamilyTree.templates.myTemplate_female.died = '<foreignobject class="node" x="80" y="-5" width="30" height="30"><img src="assets/allahummaghfirlahu.png" width="30" height="30"></foreignobject>';
  FamilyTree.templates.myTemplate_female.field_0 = '<rect x="0" y="130" height="25" width="120" stroke-width="2" fill="#FFC0CB" stroke="#ffffff" rx="7" ry="7"></rect><text width="230" style="font-size: 16px;font-weight:bold;" fill="#000000" x="60" y="148" text-anchor="middle">{val}</text>';

  FamilyTree.templates.myTemplate.defs = '<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart"><path fill="#FF251B" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/></g>';

  // Define a template for filtered nodes
  FamilyTree.templates.filtered = Object.assign({}, FamilyTree.templates.tommy);
  FamilyTree.templates.filtered.node = '<rect x="0" y="0" height="{h}" width="{w}"stroke-width="1" fill="#aeaeae" stroke="#aeaeae" rx="7" ry="7"></rect>';

  // Display loading spinner before fetching and initializing family data
  document.getElementById("loading-spinner").style.display = "block";

  // Function to fetch family data and initialize family tree
  function fetchFamilyDataAndInitialize() {
    return fetchFamilyData()
      .then(function (data) {
        familyData = data;
        totalMembers = familyData.length;
        // Return total members count
        return { totalMembers };
      })
      .catch(function (error) {
        console.log('Error:', error);
        return null;
      });
  }

  // Function to initialize family data, either from local storage or by fetching from server
  function initializeFamilyData() {
    // Retrieve family data from local storage if available and not expired
    const storedData = {
      familyData: localStorage.getItem("familyData"),
      expiryTime: localStorage.getItem("familyDataExpiry")
    };

    if (storedData.familyData && storedData.expiryTime > Date.now()) {
      // Use family data from local storage
      familyData = JSON.parse(storedData.familyData);
      totalMembers = familyData.length;
      return Promise.resolve({ totalMembers });
    } else {
      // Fetch family data and save it in local storage
      return fetchFamilyDataAndInitialize()
        .then(function (data) {
          if (data) {
            // Save family data in local storage along with expiration time
            const expirationTime = Date.now() + (1 * 60 * 60 * 1000); // Expiry time in milliseconds (1 hour)
            localStorage.setItem("familyData", JSON.stringify(familyData));
            localStorage.setItem("familyDataExpiry", expirationTime);
          }
          return data;
        });
    }
  }

  function getOptions() {
    const searchParams = new URLSearchParams(window.location.search);
    var fit = searchParams.get('fit');
    var enableSearch = true;
    var scaleInitial = 1;
    if (fit == 'yes') {
      enableSearch = false;
      scaleInitial = FamilyTree.match.boundary;
    }
    return { enableSearch, scaleInitial };
  }

  // Function to initialize the family tree
  function initializeFamilyTree() {
    var options = getOptions();

    // Function to create the family tree with the specified orientation
    var createFamilyTree = function (orientation) {
      var family = new FamilyTree(document.getElementById("tree"), {
        mouseScrool: FamilyTree.action.zoom,
        scaleInitial: options.scaleInitial,
        mode: 'dark',
        template: 'myTemplate',
        minPartnerSeparation: 40,
        levelSeparation: 70,
        siblingSeparation: 30,
        collapse: {
          level: 2
        },
        toolbar: {
          fullScreen: true,
          zoom: true,
          fit: true,
          expandAll: true,
        },
        nodeBinding: {
          field_0: 'name',
          img_0: 'photo',
          died: 'died'
        },
        editForm: {
          readOnly: true,
          titleBinding: "name",
          photoBinding: "photo",
          buttons: {
            edit: null,
            remove: null
          },
          generateElementsFromFields: false,
          elements: [
            { type: 'textbox', label: 'Nama', binding: 'fullname' },
            { type: 'textbox', label: 'Alamat', binding: 'address' },
            { type: 'textbox', label: 'Tanggal Lahir', binding: 'born' },
            { type: 'textbox', label: 'Wafat', binding: 'died' },
            { type: 'textbox', label: 'Umur', binding: 'age' },
            { type: 'textbox', label: 'HP', binding: 'phone' },
          ]
        },
        searchFields: ['name', 'fullname'],
        onEditFormRender: function ({ data, container }) {
          if (data.gender === "male") {
            container.style.backgroundColor = "#2196F3";
          } else if (data.gender === "female") {
            container.style.backgroundColor = "#FFC0CB";
          }
        },

        nodes: familyData, // Provide the family data for rendering the tree
      });

      // Event listener for expand/collapse actions on nodes
      family.on('expcollclick', function (sender, isCollapsing, nodeId) {
        var node = family.getNode(nodeId);
        if (isCollapsing) {
          family.expandCollapse(nodeId, [], node.ftChildrenIds);
        } else {
          family.expandCollapse(nodeId, node.ftChildrenIds, []);
        }
        return false;
      });

      // Event listener for custom rendering of links between nodes
      family.on('render-link', function (sender, args) {
        if (args.cnode.ppid != undefined)
          args.html += '<use data-ctrl-ec-id="' + args.node.id + '" xlink:href="#heart" x="' + (args.p.xa) + '" y="' + (args.p.ya) + '"/>';
        if (args.cnode.isPartner && args.node.partnerSeparation == 40)
          args.html += '<use data-ctrl-ec-id="' + args.node.id + '" xlink:href="#heart" x="' + (args.p.xb) + '" y="' + (args.p.yb) + '"/>';
      });

      return family; // Return the created family tree
    };

    // Create the family tree with the initial orientation (bottom left)
    var family = createFamilyTree(FamilyTree.orientation.top);
  }

  // Initialize family data and then initialize the family tree
  initializeFamilyData()
    .then(function (data) {
      if (data) {
        // Update the total member count in the HTML
        document.getElementById("total-members").textContent = data.totalMembers;
        // Hide the loading spinner
        document.getElementById("loading-spinner").style.display = "none";
        // Initialize the family tree
        initializeFamilyTree();
      }
    });

}
